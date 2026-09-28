import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configuración de cabeceras HTTP de seguridad con Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https://api.dicebear.com'],
        connectSrc: ["'self'", 'ws:', 'wss:'],
        mediaSrc: ["'self'", 'data:']
      }
    },
    crossOriginEmbedderPolicy: false
  })
);
app.disable('x-powered-by');

app.use(cors());
app.use(express.json({ limit: '100kb' }));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// En memoria (RAM) - Efímero 100%
// rooms: Map<roomId, RoomState>
const rooms = new Map();

// Control de tasa de eventos en memoria por socket
const socketRateLimits = new Map();

/**
 * Valida la tasa de emisión de un socket (Token Bucket / Sliding Window)
 * @param {string} socketId 
 * @param {string} type 
 * @param {number} maxPerSec 
 * @returns {boolean}
 */
function checkRateLimit(socketId, type, maxPerSec = 5) {
  const now = Date.now();
  if (!socketRateLimits.has(socketId)) {
    socketRateLimits.set(socketId, { reactions: [], votes: [] });
  }
  const record = socketRateLimits.get(socketId);
  const timestamps = record[type] || [];
  const recent = timestamps.filter(t => now - t < 1000);
  if (recent.length >= maxPerSec) {
    return false;
  }
  recent.push(now);
  record[type] = recent;
  return true;
}

/**
 * Generador de IDs de sala con entropía criptográfica y garantía anti-colisión
 * @returns {string} ID de 6 caracteres hexadecimales en mayúscula
 */
function generateSecureRoomId() {
  let id;
  let attempts = 0;
  do {
    id = crypto.randomBytes(3).toString('hex').toUpperCase();
    attempts++;
  } while (rooms.has(id) && attempts < 100);
  return id;
}

// Baraja oficial de cartas permitidas para votación
const VALID_DECK_VALUES = [0, 1, 2, 3, 5, 8, 13, 20, 40, 100, '?', '☕'];

/**
 * Verifica si el socket o token suministrado está autorizado como anfitrión
 * @param {object} room 
 * @param {object} socket 
 * @param {string} hostToken 
 * @returns {boolean}
 */
function isHostAuthorized(room, socket, hostToken) {
  if (!room) return false;
  if (hostToken && room.hostToken && hostToken === room.hostToken) return true;
  return room.hostId === socket.id;
}

/**
 * Helper para serializar el estado de la sala para los clientes
 * Oculta los votos reales si la ronda no ha sido revelada
 */
function getRoomPublicState(roomId) {
  const room = rooms.get(roomId);
  if (!room) return null;

  const participantsList = Array.from(room.participants.values()).map(p => ({
    id: p.id,
    name: p.name,
    avatarSeed: p.avatarSeed || p.name,
    isHost: p.id === room.hostId,
    isSpectator: p.isSpectator,
    hasVoted: p.vote !== null,
    // Solo revela el voto si la ronda está revelada o si es espectador
    vote: room.revealed ? p.vote : null
  }));

  // Calcular métricas si está revelado
  let metrics = null;
  if (room.revealed) {
    const numericVotes = participantsList
      .filter(p => !p.isSpectator && p.vote !== null && typeof p.vote === 'number' && Number.isFinite(p.vote));

    if (numericVotes.length > 0) {
      const sum = numericVotes.reduce((acc, curr) => acc + curr.vote, 0);
      const avg = Number((sum / numericVotes.length).toFixed(1));
      
      // Contar frecuencias
      const counts = {};
      let maxCount = 0;
      let mode = null;
      numericVotes.forEach(p => {
        counts[p.vote] = (counts[p.vote] || 0) + 1;
        if (counts[p.vote] > maxCount) {
          maxCount = counts[p.vote];
          mode = p.vote;
        }
      });

      const isConsensus = numericVotes.length > 1 && numericVotes.every(p => p.vote === numericVotes[0].vote);

      metrics = {
        average: avg,
        mode: mode,
        isConsensus,
        voteCount: numericVotes.length
      };
    } else {
      metrics = {
        average: null,
        mode: null,
        isConsensus: false,
        voteCount: 0
      };
    }
  }

  return {
    id: room.id,
    hostId: room.hostId,
    tasks: room.tasks,
    currentTaskIndex: room.currentTaskIndex,
    revealed: room.revealed,
    participants: participantsList,
    metrics,
    timer: room.timer || { duration: 60, endsAt: null, isRunning: false, remainingSeconds: 60 }
  };
}

/**
 * Helper para limpiar y cancelar el temporizador en memoria de una sala
 */
function clearRoomTimer(room) {
  if (room && room.timerTimeout) {
    clearTimeout(room.timerTimeout);
    room.timerTimeout = null;
  }
}

io.on('connection', (socket) => {
  let currentRoomId = null;

  // 1. Crear sala
  socket.on('room:create', ({ userName, isSpectator = false, avatarSeed }, callback) => {
    const roomId = generateSecureRoomId();
    const hostToken = crypto.randomBytes(16).toString('hex');
    const finalName = (userName || '').trim().slice(0, 30) || 'Anfitrión';
    const finalAvatar = (avatarSeed || finalName).trim().slice(0, 60);

    rooms.set(roomId, {
      id: roomId,
      hostId: socket.id,
      hostToken,
      lastActivity: Date.now(),
      tasks: [],
      currentTaskIndex: 0,
      revealed: false,
      timer: {
        duration: 60,
        endsAt: null,
        isRunning: false,
        remainingSeconds: 60
      },
      participants: new Map([
        [socket.id, {
          id: socket.id,
          name: finalName,
          avatarSeed: finalAvatar,
          isSpectator,
          vote: null
        }]
      ])
    });

    currentRoomId = roomId;
    socket.join(roomId);

    const state = getRoomPublicState(roomId);
    if (typeof callback === 'function') {
      callback({ success: true, roomId, hostToken, state });
    }
    io.to(roomId).emit('room:updated', state);
  });

  // 2. Unirse a sala
  socket.on('room:join', ({ roomId, userName, isSpectator = false, avatarSeed, hostToken }, callback) => {
    const formattedRoomId = (roomId || '').trim().toUpperCase();
    const room = rooms.get(formattedRoomId);

    if (!room) {
      if (typeof callback === 'function') {
        return callback({ success: false, message: 'La sala no existe o ha expirado.' });
      }
      return;
    }

    // Verificar si es el anfitrión reconectándose con su hostToken
    const isReconnectingHost = Boolean(hostToken && room.hostToken && hostToken === room.hostToken);

    // Límite de capacidad (máximo 30 participantes, salvo que sea el anfitrión reconectándose)
    if (room.participants.size >= 30 && !isReconnectingHost && !room.participants.has(socket.id)) {
      if (typeof callback === 'function') {
        return callback({ success: false, message: 'La sala ha alcanzado su capacidad máxima (30 participantes).' });
      }
      return;
    }

    // Salir ordenadamente de sala previa si cambió de sala
    if (currentRoomId && currentRoomId !== formattedRoomId) {
      const prevRoom = rooms.get(currentRoomId);
      if (prevRoom) {
        prevRoom.participants.delete(socket.id);
        socket.leave(currentRoomId);
        if (prevRoom.participants.size === 0) {
          clearRoomTimer(prevRoom);
          rooms.delete(currentRoomId);
        } else {
          io.to(currentRoomId).emit('room:updated', getRoomPublicState(currentRoomId));
        }
      }
    }

    currentRoomId = formattedRoomId;
    socket.join(formattedRoomId);
    room.lastActivity = Date.now();

    const finalName = (userName || '').trim().slice(0, 30) || 'Participante';
    const finalAvatar = (avatarSeed || finalName).trim().slice(0, 60);

    // Si es anfitrión con token válido, reasignar hostId a este nuevo socket
    if (isReconnectingHost) {
      room.hostId = socket.id;
    }

    room.participants.set(socket.id, {
      id: socket.id,
      name: finalName,
      avatarSeed: finalAvatar,
      isSpectator,
      vote: null
    });

    const state = getRoomPublicState(formattedRoomId);
    if (typeof callback === 'function') {
      callback({
        success: true,
        roomId: formattedRoomId,
        hostToken: isReconnectingHost ? room.hostToken : undefined,
        state
      });
    }
    io.to(formattedRoomId).emit('room:updated', state);
  });

  // 3. Emitir voto
  socket.on('vote:cast', ({ value }) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room || room.revealed) return;

    if (!checkRateLimit(socket.id, 'votes', 10)) return;

    // Validación estricta de baraja (rechaza NaN, Infinity, strings maliciosos)
    if (value !== null && !VALID_DECK_VALUES.includes(value)) {
      return;
    }

    const participant = room.participants.get(socket.id);
    if (participant && !participant.isSpectator) {
      participant.vote = value;
      room.lastActivity = Date.now();
      io.to(currentRoomId).emit('room:updated', getRoomPublicState(currentRoomId));
    }
  });

  // 4. Cambiar rol espectador/votante
  socket.on('vote:toggle-spectator', ({ isSpectator }) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room) return;

    const participant = room.participants.get(socket.id);
    if (participant) {
      participant.isSpectator = Boolean(isSpectator);
      if (participant.isSpectator) participant.vote = null;
      room.lastActivity = Date.now();
      io.to(currentRoomId).emit('room:updated', getRoomPublicState(currentRoomId));
    }
  });

  // 5. Revelar cartas (Solo anfitrión autorizado)
  socket.on('round:reveal', ({ hostToken } = {}) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room || !isHostAuthorized(room, socket, hostToken)) return;

    clearRoomTimer(room);
    if (room.timer) {
      room.timer.isRunning = false;
      room.timer.endsAt = null;
    }
    room.revealed = true;
    room.lastActivity = Date.now();
    io.to(currentRoomId).emit('room:updated', getRoomPublicState(currentRoomId));
  });

  // 6. Reiniciar ronda (Solo anfitrión autorizado)
  socket.on('round:reset', ({ hostToken } = {}) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room || !isHostAuthorized(room, socket, hostToken)) return;

    clearRoomTimer(room);
    room.revealed = false;
    room.participants.forEach(p => {
      p.vote = null;
    });

    if (room.timer) {
      room.timer.endsAt = null;
      room.timer.isRunning = false;
      room.timer.remainingSeconds = room.timer.duration || 60;
    }

    room.lastActivity = Date.now();
    io.to(currentRoomId).emit('room:updated', getRoomPublicState(currentRoomId));
  });

  // Temporizador de ronda (Solo anfitrión autorizado)
  socket.on('timer:start', ({ duration, hostToken } = {}) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room || !isHostAuthorized(room, socket, hostToken)) return;

    if (!room.timer) {
      room.timer = { duration: 60, endsAt: null, isRunning: false, remainingSeconds: 60 };
    }

    const validDurations = [1, 2, 20, 40, 60, 80];
    const newDuration = validDurations.includes(Number(duration))
      ? Number(duration)
      : (room.timer.duration || 60);

    room.timer.duration = newDuration;
    const secondsToCount = room.timer.remainingSeconds > 0 && room.timer.remainingSeconds <= newDuration && !room.timer.endsAt
      ? room.timer.remainingSeconds
      : newDuration;

    room.timer.endsAt = Date.now() + secondsToCount * 1000;
    room.timer.isRunning = true;
    room.timer.remainingSeconds = secondsToCount;

    clearRoomTimer(room);
    room.timerTimeout = setTimeout(() => {
      const activeRoom = rooms.get(currentRoomId);
      if (activeRoom && activeRoom.timer && activeRoom.timer.isRunning) {
        activeRoom.revealed = true;
        activeRoom.timer.isRunning = false;
        activeRoom.timer.endsAt = null;
        activeRoom.timer.remainingSeconds = 0;
        clearRoomTimer(activeRoom);
        io.to(currentRoomId).emit('room:updated', getRoomPublicState(currentRoomId));
      }
    }, secondsToCount * 1000);

    room.lastActivity = Date.now();
    io.to(currentRoomId).emit('room:updated', getRoomPublicState(currentRoomId));
  });

  socket.on('timer:pause', ({ hostToken } = {}) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room || !isHostAuthorized(room, socket, hostToken) || !room.timer || !room.timer.isRunning) return;

    clearRoomTimer(room);
    const remaining = Math.max(0, Math.ceil((room.timer.endsAt - Date.now()) / 1000));
    room.timer.isRunning = false;
    room.timer.endsAt = null;
    room.timer.remainingSeconds = remaining;

    room.lastActivity = Date.now();
    io.to(currentRoomId).emit('room:updated', getRoomPublicState(currentRoomId));
  });

  socket.on('timer:reset', ({ duration, hostToken } = {}) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room || !isHostAuthorized(room, socket, hostToken) || !room.timer) return;

    clearRoomTimer(room);
    const validDurations = [1, 2, 20, 40, 60, 80];
    if (validDurations.includes(Number(duration))) {
      room.timer.duration = Number(duration);
    }

    room.timer.isRunning = false;
    room.timer.endsAt = null;
    room.timer.remainingSeconds = room.timer.duration;

    room.lastActivity = Date.now();
    io.to(currentRoomId).emit('room:updated', getRoomPublicState(currentRoomId));
  });

  // 7. Gestión de tareas (Solo anfitrión autorizado, con cuotas máximas)
  socket.on('task:set-list', ({ tasks, hostToken } = {}) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room || !isHostAuthorized(room, socket, hostToken)) return;

    // Cuotas: Máximo 50 tareas, máximo 300 caracteres por título
    room.tasks = Array.isArray(tasks)
      ? tasks
          .slice(0, 50)
          .filter(t => typeof t === 'string' && t.trim().length > 0)
          .map(t => ({ title: t.trim().slice(0, 300), score: null }))
      : [];
    room.currentTaskIndex = 0;
    room.revealed = false;
    room.participants.forEach(p => { p.vote = null; });
    clearRoomTimer(room);
    if (room.timer) {
      room.timer.endsAt = null;
      room.timer.isRunning = false;
      room.timer.remainingSeconds = room.timer.duration || 60;
    }

    room.lastActivity = Date.now();
    io.to(currentRoomId).emit('room:updated', getRoomPublicState(currentRoomId));
  });

  // Guardar puntuación final de la tarea activa y opcionalmente avanzar
  socket.on('task:save-score', ({ score, autoAdvance = true, hostToken } = {}) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room || !isHostAuthorized(room, socket, hostToken)) return;

    if (room.tasks[room.currentTaskIndex]) {
      // Validar score seguro: número finito, string corto o null
      const safeScore = (score === null || (typeof score === 'string' && score.length <= 30) || (typeof score === 'number' && Number.isFinite(score)))
        ? score
        : null;
      room.tasks[room.currentTaskIndex].score = safeScore;
    }

    if (autoAdvance && room.currentTaskIndex < room.tasks.length - 1) {
      room.currentTaskIndex += 1;
    }

    room.revealed = false;
    room.participants.forEach(p => { p.vote = null; });
    clearRoomTimer(room);
    if (room.timer) {
      room.timer.endsAt = null;
      room.timer.isRunning = false;
      room.timer.remainingSeconds = room.timer.duration || 60;
    }

    room.lastActivity = Date.now();
    io.to(currentRoomId).emit('room:updated', getRoomPublicState(currentRoomId));
  });

  socket.on('task:select', ({ index, hostToken } = {}) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room || !isHostAuthorized(room, socket, hostToken)) return;

    const parsedIndex = Number(index);
    if (Number.isInteger(parsedIndex) && parsedIndex >= 0 && parsedIndex < room.tasks.length) {
      room.currentTaskIndex = parsedIndex;
      room.revealed = false;
      room.participants.forEach(p => { p.vote = null; });
      clearRoomTimer(room);
      if (room.timer) {
        room.timer.endsAt = null;
        room.timer.isRunning = false;
        room.timer.remainingSeconds = room.timer.duration || 60;
      }
      room.lastActivity = Date.now();
      io.to(currentRoomId).emit('room:updated', getRoomPublicState(currentRoomId));
    }
  });

  socket.on('task:next', ({ hostToken } = {}) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room || !isHostAuthorized(room, socket, hostToken)) return;

    if (room.currentTaskIndex < room.tasks.length - 1) {
      room.currentTaskIndex += 1;
      room.revealed = false;
      room.participants.forEach(p => { p.vote = null; });
      clearRoomTimer(room);
      if (room.timer) {
        room.timer.endsAt = null;
        room.timer.isRunning = false;
        room.timer.remainingSeconds = room.timer.duration || 60;
      }
      room.lastActivity = Date.now();
      io.to(currentRoomId).emit('room:updated', getRoomPublicState(currentRoomId));
    }
  });

  socket.on('task:prev', ({ hostToken } = {}) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room || !isHostAuthorized(room, socket, hostToken)) return;

    if (room.currentTaskIndex > 0) {
      room.currentTaskIndex -= 1;
      room.revealed = false;
      room.participants.forEach(p => { p.vote = null; });
      clearRoomTimer(room);
      if (room.timer) {
        room.timer.endsAt = null;
        room.timer.isRunning = false;
        room.timer.remainingSeconds = room.timer.duration || 60;
      }
      room.lastActivity = Date.now();
      io.to(currentRoomId).emit('room:updated', getRoomPublicState(currentRoomId));
    }
  });

  // 8. Reacciones / Emojis en tiempo real con rate limiting
  socket.on('reaction:throw', ({ targetUserId, emoji }) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room) return;

    // Rate limiting: max 10 reacciones por segundo
    if (!checkRateLimit(socket.id, 'reactions', 10)) return;

    const fromParticipant = room.participants.get(socket.id);
    const targetParticipant = room.participants.get(targetUserId);

    if (fromParticipant && targetParticipant) {
      const allowedEmojis = ['🍅', '🔥', '🚀', '🎯', '🃏', '👏', '⏰', '☕', '😂'];
      const safeEmoji = allowedEmojis.includes(emoji) ? emoji : '🍅';

      room.lastActivity = Date.now();
      io.to(currentRoomId).emit('reaction:received', {
        id: crypto.randomBytes(6).toString('hex'),
        targetUserId,
        emoji: safeEmoji,
        timestamp: Date.now()
      });
    }
  });

  // Desconexión
  socket.on('disconnect', () => {
    socketRateLimits.delete(socket.id);

    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room) return;

    room.participants.delete(socket.id);

    // Si la sala se vacía por completo, se elimina de RAM
    if (room.participants.size === 0) {
      clearRoomTimer(room);
      rooms.delete(currentRoomId);
      return;
    }

    // Si se desconecta el anfitrión, delegar temporalmente al siguiente participante
    // (el hostToken original sigue siendo válido si el anfitrión recarga o reconecta)
    if (room.hostId === socket.id) {
      const nextHostId = room.participants.keys().next().value;
      room.hostId = nextHostId;
    }

    room.lastActivity = Date.now();
    io.to(currentRoomId).emit('room:updated', getRoomPublicState(currentRoomId));
  });
});

// Limpieza periódica de salas inactivas (Janitor) tras 8 horas
setInterval(() => {
  const now = Date.now();
  const EIGHT_HOURS = 8 * 60 * 60 * 1000;
  for (const [roomId, room] of rooms.entries()) {
    if (now - (room.lastActivity || 0) > EIGHT_HOURS) {
      clearRoomTimer(room);
      rooms.delete(roomId);
    }
  }
}, 30 * 60 * 1000);

// Servir frontend compilado
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', activeRooms: rooms.size });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`[Poker Planning Server] Corriendo en http://localhost:${PORT}`);
});
