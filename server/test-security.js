import { io } from 'socket.io-client';

async function connectSocket(url) {
  return new Promise((resolve, reject) => {
    const s = io(url, { reconnection: false, forceNew: true });
    if (s.connected) return resolve(s);
    s.once('connect', () => resolve(s));
    s.once('connect_error', reject);
  });
}

async function runSecurityAudit() {
  console.log('🛡️  INICIANDO SUITE DE AUDITORÍA Y SEGURIDAD (test-security.js)...');
  const SERVER_URL = 'http://localhost:3000';

  // 1. AUDITORÍA DE CABECERAS HTTP (HELMET)
  console.log('\n[1/7] Verificando Cabeceras HTTP de Seguridad...');
  const res = await fetch(`${SERVER_URL}/health`);
  const headers = res.headers;

  const nosniff = headers.get('x-content-type-options');
  const frameOptions = headers.get('x-frame-options');
  const poweredBy = headers.get('x-powered-by');
  const csp = headers.get('content-security-policy');

  if (nosniff !== 'nosniff') throw new Error(`Fallo: x-content-type-options esperado 'nosniff', recibido '${nosniff}'`);
  if (frameOptions !== 'SAMEORIGIN') throw new Error(`Fallo: x-frame-options esperado 'SAMEORIGIN', recibido '${frameOptions}'`);
  if (poweredBy) throw new Error(`Fallo de seguridad: x-powered-by expuesto '${poweredBy}'`);
  if (!csp) throw new Error('Fallo: Content-Security-Policy ausente');
  console.log('  ✓ Cabeceras verificadas: nosniff, SAMEORIGIN, CSP activa, x-powered-by oculto');

  // 2. GENERACIÓN CRIPTOSEGURA Y FORMATO DE ID
  console.log('\n[2/7] Probando Entropía y Formato Criptoseguro de IDs...');
  const hostSocket = await connectSocket(SERVER_URL);
  const createRes = await new Promise((resolve) => {
    hostSocket.emit('room:create', { userName: 'Auditor Sec', avatarSeed: 'seed-auditor' }, resolve);
  });

  const { roomId, hostToken } = createRes;
  if (!/^[0-9A-F]{6}$/.test(roomId)) {
    throw new Error(`Fallo: RoomId no cumple con formato hexadecimal de 6 caracteres: ${roomId}`);
  }
  if (!/^[0-9a-f]{32}$/.test(hostToken)) {
    throw new Error(`Fallo: hostToken no cumple formato criptográfico seguro de 32 caracteres: ${hostToken}`);
  }
  console.log(`  ✓ Sala generada con ID criptográfico: ${roomId}`);
  console.log(`  ✓ Token de anfitrión seguro emitido: ${hostToken.substring(0, 8)}... (longitud ${hostToken.length})`);

  // 3. INTENTO DE ACCIÓN ADMINISTRATIVA POR USUARIO NO AUTORIZADO
  console.log('\n[3/7] Probando Autorización de Anfitrión (Anti-Host Hijacking)...');
  const attackerSocket = await connectSocket(SERVER_URL);
  await new Promise((resolve) => {
    attackerSocket.emit('room:join', { roomId, userName: 'Attacker' }, resolve);
  });

  // El atacante intenta resetear o revelar cartas sin ser anfitrión
  attackerSocket.emit('round:reveal');
  await new Promise((r) => setTimeout(r, 100));

  const stateAfterAttack = await new Promise((resolve) => {
    hostSocket.once('room:updated', resolve);
    // Disparamos un evento legítimo leve para leer el estado
    hostSocket.emit('vote:toggle-spectator', { isSpectator: false });
  });

  if (stateAfterAttack.revealed) {
    throw new Error('Vulnerabilidad detectada: un usuario no anfitrión pudo forzar la revelación de cartas');
  }
  console.log('  ✓ El servidor bloqueó intento de acción administrativa por usuario no autorizado');

  // 4. SUPERVIVENCIA Y RECUPERACIÓN DE HOST CON hostToken ANTE DESCONEXIÓN
  console.log('\n[4/7] Probando Recuperación de Host tras Desconexión/F5...');
  hostSocket.disconnect();
  await new Promise((r) => setTimeout(r, 100));

  // El anfitrión vuelve a conectarse en una nueva conexión simulando recarga de página (F5)
  const reconnectedHostSocket = await connectSocket(SERVER_URL);
  const rejoinRes = await new Promise((resolve) => {
    reconnectedHostSocket.emit('room:join', {
      roomId,
      userName: 'Auditor Sec',
      hostToken
    }, resolve);
  });

  if (!rejoinRes.success) throw new Error('Fallo al reincorporarse a la sala');
  const hostParticipant = rejoinRes.state.participants.find(p => p.id === reconnectedHostSocket.id);
  if (!hostParticipant || !hostParticipant.isHost) {
    throw new Error('Fallo: El anfitrión no pudo recuperar su rol usando el hostToken legítimo');
  }
  console.log('  ✓ Anfitrión recuperó exitosamente el control y rol de Host usando su hostToken');

  // 5. ENVENENAMIENTO DE VOTOS Y MÉTRICAS (NUMERIC POISONING)
  console.log('\n[5/7] Probando Rechazo de Votos Maliciosos (NaN, Infinity, Strings)...');
  const voterSocket = attackerSocket; // Usamos el segundo socket como votante

  // Enviar votos corruptos
  voterSocket.emit('vote:cast', { value: NaN });
  voterSocket.emit('vote:cast', { value: Infinity });
  voterSocket.emit('vote:cast', { value: -999 });
  voterSocket.emit('vote:cast', { value: '<script>alert(1)</script>' });
  await new Promise((r) => setTimeout(r, 100));

  let publicState = await new Promise((resolve) => {
    reconnectedHostSocket.once('room:updated', resolve);
    reconnectedHostSocket.emit('vote:cast', { value: 8 });
  });

  const voterState = publicState.participants.find(p => p.id === voterSocket.id);
  if (voterState.hasVoted) {
    throw new Error(`Fallo: El servidor aceptó un voto inválido o corrupto: ${voterState.vote}`);
  }
  console.log('  ✓ Votos NaN, Infinity y valores fuera de baraja fueron rechazados exitosamente');

  // Voto válido y cálculo de métricas
  voterSocket.emit('vote:cast', { value: 8 });
  await new Promise((r) => setTimeout(r, 100));

  const revealPromise = new Promise((resolve) => {
    voterSocket.once('room:updated', resolve);
  });
  reconnectedHostSocket.emit('round:reveal', { hostToken });
  const finalRevealedState = await revealPromise;

  if (finalRevealedState.metrics.average !== 8 || !finalRevealedState.metrics.isConsensus) {
    throw new Error('Fallo: Las métricas numéricas con votos legítimos fallaron');
  }
  console.log('  ✓ Métricas calculadas limpiamente sin corrupción matemática:', finalRevealedState.metrics);

  // 6. PROTECCIÓN CONTRA CARGA MASIVA DE TAREAS (TASK BOMBING)
  console.log('\n[6/7] Probando Cuotas de Seguridad en Tareas (Task Bombing Protection)...');
  const hugeTaskList = Array.from({ length: 100 }, (_, i) => `Tarea ${i}: ` + 'X'.repeat(600));

  reconnectedHostSocket.emit('task:set-list', { tasks: hugeTaskList, hostToken });
  const taskState = await new Promise((resolve) => {
    voterSocket.once('room:updated', resolve);
  });

  if (taskState.tasks.length > 50) {
    throw new Error(`Fallo: El servidor no limitó el número máximo de tareas (recibidas ${taskState.tasks.length})`);
  }
  const sampleTask = taskState.tasks[0];
  if (sampleTask.title.length > 300) {
    throw new Error(`Fallo: La tarea no fue recortada al límite de 300 caracteres (longitud: ${sampleTask.title.length})`);
  }
  console.log(`  ✓ Lista truncada de 100 a ${taskState.tasks.length} tareas (límite: 50)`);
  console.log(`  ✓ Título recortado de 609 a ${sampleTask.title.length} caracteres (límite: 300)`);

  // 7. PROTECCIÓN CONTRA RÁFAGAS / FLOODING (RATE LIMITING)
  console.log('\n[7/7] Probando Limitador de Tasa en Sockets (Flood Protection)...');
  let receivedCount = 0;
  voterSocket.on('reaction:received', () => {
    receivedCount++;
  });

  // Disparamos 30 reacciones en ráfaga instantánea
  for (let i = 0; i < 30; i++) {
    reconnectedHostSocket.emit('reaction:throw', { targetUserId: voterSocket.id, emoji: '🔥' });
  }

  // Esperamos 400ms para recolectar
  await new Promise((r) => setTimeout(r, 400));

  if (receivedCount > 10) {
    throw new Error(`Fallo de Rate Limit: Se recibieron ${receivedCount} reacciones de 30 (esperadas max 10)`);
  }
  console.log(`  ✓ Ráfaga de 30 reacciones mitigada a ${receivedCount} eventos permitidos (Rate limiter activo)`);

  // Desconectar clientes
  reconnectedHostSocket.disconnect();
  voterSocket.disconnect();
  console.log('\n✅ TODAS LAS PRUEBAS DE SEGURIDAD Y RESILIENCIA PASARON CON ÉXITO (7/7)');
}

runSecurityAudit().then(() => {
  process.exit(0);
}).catch((err) => {
  console.error('\n❌ ERROR EN AUDITORÍA DE SEGURIDAD:', err);
  process.exit(1);
});
