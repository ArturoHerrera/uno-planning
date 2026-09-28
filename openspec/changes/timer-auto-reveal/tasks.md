# Tasks: timer-auto-reveal

## 1. Backend: Temporizador autoritativo y auto-revelación

- [x] 1.1 Implementar función `clearRoomTimer(room)` y programación de `room.timerTimeout = setTimeout(...)` en `server/index.js` al recibir `timer:start`, configurando la revelación automática (`room.revealed = true`, `room.timer.isRunning = false`, `room.timer.endsAt = null`) y emisión de `room:updated` al expirar el tiempo.
- [x] 1.2 Integrar `clearRoomTimer(room)` en `round:reveal`, `timer:pause`, `timer:reset`, `round:reset` y en la desconexión del último participante cuando se elimina la sala.
- [x] 1.3 Añadir caso de prueba en `server/test-e2e.js` que inicie un temporizador y valide que la sala transiciona automáticamente a `revealed === true` y abre la ronda sin intervención manual.

## 2. Frontend: Sincronización de cliente y paisaje sonoro

- [x] 2.1 Actualizar `client/src/components/RoundTimer.jsx` para que el intervalo y los tics se detengan limpiamente si `roomState.revealed === true` o `timer.isRunning === false`.
- [x] 2.2 Asegurar que al detonarse la revelación automática por timer, suene el chime zen final y el modal de resultados (`ResultsModal`) se abra inmediatamente para todos los participantes.

## 3. Validación y compilación

- [x] 3.1 Ejecutar suite de pruebas con `node server/test-e2e.js` y verificar compilación de frontend con `npm run build --prefix client`.
