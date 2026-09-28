import { io } from 'socket.io-client';

async function connectSocket(url) {
  return new Promise((resolve, reject) => {
    const s = io(url, { reconnection: false, forceNew: true });
    if (s.connected) return resolve(s);
    s.once('connect', () => resolve(s));
    s.once('connect_error', reject);
  });
}

async function runE2ETest() {
  console.log('🧪 Iniciando prueba E2E de simulación multi-cliente...');
  const SERVER_URL = 'http://localhost:3000';

  // 1. Conectar anfitrión
  const hostSocket = await connectSocket(SERVER_URL);
  console.log('✓ Host conectado');

  // 2. Crear sala con avatarSeed
  const createRes = await new Promise((resolve) => {
    hostSocket.emit('room:create', { userName: 'Anfitrión José', isSpectator: false, avatarSeed: 'seed-host' }, resolve);
  });
  console.log(`✓ Sala creada con ID: ${createRes.roomId}, avatar: ${createRes.state.participants[0]?.avatarSeed}`);
  if (createRes.state.participants[0]?.avatarSeed !== 'seed-host') {
    throw new Error('Fallo en la asignación de avatarSeed al anfitrión');
  }
  const roomId = createRes.roomId;

  // 3. Conectar y unir votante con avatarSeed
  const voterSocket = await connectSocket(SERVER_URL);
  const joinVoterRes = await new Promise((resolve) => {
    voterSocket.emit('room:join', { roomId, userName: 'Votante María', isSpectator: false, avatarSeed: 'seed-voter' }, resolve);
  });
  console.log('✓ Votante María unida');

  // 4. Conectar y unir espectador
  const spectatorSocket = await connectSocket(SERVER_URL);
  const joinSpectatorRes = await new Promise((resolve) => {
    spectatorSocket.emit('room:join', { roomId, userName: 'Observador Carlos', isSpectator: true, avatarSeed: 'seed-spectator' }, resolve);
  });
  console.log('✓ Observador Carlos unido como espectador');

  // 5. Cargar lista de tareas Jira
  hostSocket.emit('task:set-list', {
    tasks: [
      'https://jira.company.com/browse/ENG-101',
      'https://jira.company.com/browse/ENG-102'
    ]
  });
  await new Promise((r) => setTimeout(r, 100));

  // 6. Prueba de Robustez: Revelar con 0 votos emitidos
  const revealEmptyPromise = new Promise((resolve) => {
    voterSocket.once('room:updated', (state) => {
      if (state.revealed) resolve(state);
    });
  });
  hostSocket.emit('round:reveal');
  const emptyRevealed = await revealEmptyPromise;
  console.log('✓ Ronda revelada con 0 votos sin excepciones:', emptyRevealed.metrics);
  if (!emptyRevealed.metrics || emptyRevealed.metrics.voteCount !== 0 || emptyRevealed.metrics.average !== null) {
    throw new Error('Fallo: las métricas de ronda vacía no están normalizadas');
  }

  // Reiniciar ronda
  hostSocket.emit('round:reset');
  await new Promise((r) => setTimeout(r, 100));

  // 7. Prueba de Robustez: Votos cualitativos ('☕', '?')
  hostSocket.emit('vote:cast', { value: '☕' });
  voterSocket.emit('vote:cast', { value: '?' });
  await new Promise((r) => setTimeout(r, 100));

  const revealQualitativePromise = new Promise((resolve) => {
    voterSocket.once('room:updated', (state) => {
      if (state.revealed) resolve(state);
    });
  });
  hostSocket.emit('round:reveal');
  const qualitativeRevealed = await revealQualitativePromise;
  console.log('✓ Ronda con votos cualitativos (☕, ?) revelada sin excepciones:', qualitativeRevealed.metrics);
  if (!qualitativeRevealed.metrics || qualitativeRevealed.metrics.voteCount !== 0) {
    throw new Error('Fallo: las métricas con votos no numéricos fallaron');
  }

  // Reiniciar ronda para votación numérica
  hostSocket.emit('round:reset');
  await new Promise((r) => setTimeout(r, 100));

  // 8. Votar numéricamente
  hostSocket.emit('vote:cast', { value: 5 });
  voterSocket.emit('vote:cast', { value: 5 });
  await new Promise((r) => setTimeout(r, 100));

  // 9. Revelar ronda con consenso
  const revealPromise = new Promise((resolve) => {
    voterSocket.once('room:updated', (state) => {
      if (state.revealed) resolve(state);
    });
  });

  hostSocket.emit('round:reveal');
  const revealedState = await revealPromise;

  console.log('✓ Ronda revelada exitosamente');
  console.log('  Métricas calculadas:', revealedState.metrics);

  if (revealedState.metrics.isConsensus && revealedState.metrics.average === 5) {
    console.log('🎉 ¡Consenso unánime detectado correctamente!');
  } else {
    throw new Error('Fallo en el cálculo de métricas de consenso');
  }

  // 8. Guardar puntuación y avanzar a la siguiente tarea
  const savePromise = new Promise((resolve) => {
    voterSocket.on('room:updated', (state) => {
      if (state.tasks[0]?.score === 5 && state.currentTaskIndex === 1) {
        resolve(state);
      }
    });
  });

  hostSocket.emit('task:save-score', { score: 5, autoAdvance: true });
  const updatedTaskState = await savePromise;
  console.log('✓ Puntuación guardada y avance automático a siguiente tarea verificado:', {
    task0Score: updatedTaskState.tasks[0].score,
    currentTaskIndex: updatedTaskState.currentTaskIndex,
    revealed: updatedTaskState.revealed
  });

  // 9. Probar reacción en tiempo real anónima y en ráfaga (lluvia de emojis)
  const receivedReactions = [];
  const burstPromise = new Promise((resolve) => {
    voterSocket.on('reaction:received', (reaction) => {
      receivedReactions.push(reaction);
      if (receivedReactions.length === 5) {
        resolve(receivedReactions);
      }
    });
  });

  const emojis = ['🍅', '🔥', '🚀', '🎯', '😂'];
  for (const emoji of emojis) {
    hostSocket.emit('reaction:throw', { targetUserId: voterSocket.id, emoji });
  }

  await burstPromise;
  console.log(`✓ Ráfaga de ${receivedReactions.length} reacciones anónimas recibida con éxito:`, receivedReactions.map(r => r.emoji));

  for (const r of receivedReactions) {
    if (r.fromUserId !== undefined || r.fromName !== undefined) {
      throw new Error('Violación de privacidad: la reacción no es anónima');
    }
    if (r.targetUserId !== voterSocket.id) {
      throw new Error('Fallo en el destinatario de la reacción');
    }
  }
  console.log('✓ Anonimato estricto verificado: ninguna reacción contiene fromUserId ni fromName.');

  // Desconectar clientes
  hostSocket.disconnect();
  voterSocket.disconnect();
  spectatorSocket.disconnect();

  console.log('✓ Todos los clientes desconectados correctamente.');
}

runE2ETest().then(() => {
  process.exit(0);
}).catch((err) => {
  console.error('❌ Error en prueba E2E:', err);
  process.exit(1);
});
