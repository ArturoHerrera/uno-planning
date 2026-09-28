import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

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
      .filter(p => !p.isSpectator && p.vote !== null && typeof p.vote === 'number');

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
  let currentUserId = socket.id;

  // 1. Crear sala
  socket.on('room:create', ({ userName, isSpectator = false, avatarSeed }, callback) => {
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const finalName = (userName || '').trim() || 'Anfitrión';
    const finalAvatar = (avatarSeed || finalName).trim();
    
    rooms.set(roomId, {
      id: roomId,
      hostId: socket.id,
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
      callback({ success: true, roomId, state });
    }
    io.to(roomId).emit('room:updated', state);
  });

  // 2. Unirse a sala
  socket.on('room:join', ({ roomId, userName, isSpectator = false, avatarSeed }, callback) => {
    const formattedRoomId = (roomId || '').trim().toUpperCase();
    const room = rooms.get(formattedRoomId);

    if (!room) {
      if (typeof callback === 'function') {
        return callback({ success: false, message: 'La sala no existe o ha expirado.' });
      }
      return;
    }

    currentRoomId = formattedRoomId;
    socket.join(formattedRoomId);

    const finalName = (userName || '').trim() || 'Participante';
    const finalAvatar = (avatarSeed || finalName).trim();

    room.participants.set(socket.id, {
      id: socket.id,
      name: finalName,
      avatarSeed: finalAvatar,
      isSpectator,
      vote: null
    });

    const state = getRoomPublicState(formattedRoomId);
    if (typeof callback === 'function') {
      callback({ success: true, roomId: formattedRoomId, state });
    }
    io.to(formattedRoomId).emit('room:updated', state);
  });

  // 3. Emitir voto
  socket.on('vote:cast', ({ value }) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room || room.revealed) return;

    const participant = room.participants.get(socket.id);
    if (participant && !participant.isSpectator) {
      participant.vote = value;
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
      participant.isSpectator = isSpectator;
      if (isSpectator) participant.vote = null;
      io.to(currentRoomId).emit('room:updated', getRoomPublicState(currentRoomId));
    }
  });

  // 5. Revelar cartas (Solo anfitrión)
  socket.on('round:reveal', () => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room || room.hostId !== socket.id) return;

    clearRoomTimer(room);
    if (room.timer) {
      room.timer.isRunning = false;
      room.timer.endsAt = null;
    }
    room.revealed = true;
    io.to(currentRoomId).emit('room:updated', getRoomPublicState(currentRoomId));
  });

  // 6. Reiniciar ronda (Solo anfitrión)
  socket.on('round:reset', () => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room || room.hostId !== socket.id) return;

    clearRoomTimer(room);
    room.revealed = false;
    room.participants.forEach(p => {
      p.vote = null;
    });

    // Reiniciar timer para la nueva ronda
    if (room.timer) {
      room.timer.endsAt = null;
      room.timer.isRunning = false;
      room.timer.remainingSeconds = room.timer.duration || 60;
    }

    io.to(currentRoomId).emit('room:updated', getRoomPublicState(currentRoomId));
  });

  // Temporizador de ronda (Solo anfitrión)
  socket.on('timer:start', ({ duration } = {}) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room || room.hostId !== socket.id) return;

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

    io.to(currentRoomId).emit('room:updated', getRoomPublicState(currentRoomId));
  });

  socket.on('timer:pause', () => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room || room.hostId !== socket.id || !room.timer || !room.timer.isRunning) return;

    clearRoomTimer(room);
    const remaining = Math.max(0, Math.ceil((room.timer.endsAt - Date.now()) / 1000));
    room.timer.isRunning = false;
    room.timer.endsAt = null;
    room.timer.remainingSeconds = remaining;

    io.to(currentRoomId).emit('room:updated', getRoomPublicState(currentRoomId));
  });

  socket.on('timer:reset', ({ duration } = {}) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room || room.hostId !== socket.id || !room.timer) return;

    clearRoomTimer(room);
    const validDurations = [1, 2, 20, 40, 60, 80];
    if (validDurations.includes(Number(duration))) {
      room.timer.duration = Number(duration);
    }

    room.timer.isRunning = false;
    room.timer.endsAt = null;
    room.timer.remainingSeconds = room.timer.duration;

    io.to(currentRoomId).emit('room:updated', getRoomPublicState(currentRoomId));
  });

  // 7. Gestión de tareas (Solo anfitrión)
  socket.on('task:set-list', ({ tasks }) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room || room.hostId !== socket.id) return;

    // Convertir lista de strings a objetos { title, score: null }
    room.tasks = Array.isArray(tasks)
      ? tasks
          .filter(t => typeof t === 'string' && t.trim().length > 0)
          .map(t => ({ title: t.trim(), score: null }))
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

    io.to(currentRoomId).emit('room:updated', getRoomPublicState(currentRoomId));
  });

  // Guardar puntuación final de la tarea activa y opcionalmente avanzar
  socket.on('task:save-score', ({ score, autoAdvance = true }) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room || room.hostId !== socket.id) return;

    if (room.tasks[room.currentTaskIndex]) {
      room.tasks[room.currentTaskIndex].score = score;
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
    io.to(currentRoomId).emit('room:updated', getRoomPublicState(currentRoomId));
  });

  socket.on('task:select', ({ index }) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room || room.hostId !== socket.id) return;

    if (index >= 0 && index < room.tasks.length) {
      room.currentTaskIndex = index;
      room.revealed = false;
      room.participants.forEach(p => { p.vote = null; });
      clearRoomTimer(room);
      if (room.timer) {
        room.timer.endsAt = null;
        room.timer.isRunning = false;
        room.timer.remainingSeconds = room.timer.duration || 60;
      }
      io.to(currentRoomId).emit('room:updated', getRoomPublicState(currentRoomId));
    }
  });

  socket.on('task:next', () => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room || room.hostId !== socket.id) return;

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
      io.to(currentRoomId).emit('room:updated', getRoomPublicState(currentRoomId));
    }
  });

  socket.on('task:prev', () => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room || room.hostId !== socket.id) return;

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
      io.to(currentRoomId).emit('room:updated', getRoomPublicState(currentRoomId));
    }
  });

  // 8. Reacciones / Emojis en tiempo real
  socket.on('reaction:throw', ({ targetUserId, emoji }) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room) return;

    const fromParticipant = room.participants.get(socket.id);
    const targetParticipant = room.participants.get(targetUserId);

    if (fromParticipant && targetParticipant) {
      const allowedEmojis = ['🍅', '🔥', '🚀', '🎯', '🃏', '👏', '⏰', '☕'];
      const safeEmoji = allowedEmojis.includes(emoji) ? emoji : '🍅';

      io.to(currentRoomId).emit('reaction:received', {
        id: Math.random().toString(36).substring(2, 9),
        targetUserId,
        emoji: safeEmoji,
        timestamp: Date.now()
      });
    }
  });

  // Desconexión
  socket.on('disconnect', () => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room) return;

    room.participants.delete(socket.id);

    // Si la sala se vacía, se elimina de RAM
    if (room.participants.size === 0) {
      clearRoomTimer(room);
      rooms.delete(currentRoomId);
      return;
    }

    // Si se desconecta el anfitrión, delegar al primer participante conectado
    if (room.hostId === socket.id) {
      const nextHostId = room.participants.keys().next().value;
      room.hostId = nextHostId;
    }

    io.to(currentRoomId).emit('room:updated', getRoomPublicState(currentRoomId));
  });
});

// En producción, servir los archivos compilados del frontend Vite
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
