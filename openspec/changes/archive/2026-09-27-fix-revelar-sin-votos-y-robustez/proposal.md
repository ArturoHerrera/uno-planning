# Proposal: Robustez al Revelar Votos y Resiliencia en Modales

## Why

Durante la auditoría de calidad de código se detectó un fallo crítico en `ResultsModal.jsx`: al presionar "¡REVELAR VOTOS!" sin que nadie haya votado (o si todos los participantes votaron cartas no numéricas como `?` o `☕`), `metrics` es `null`, lo que desencadena un error fatal `TypeError: Cannot read properties of null (reading 'mode')` que desmonta la aplicación React. Además, se identificaron desincronizaciones de estado en `TaskModal.jsx` y `Lobby.jsx` al cambiar props externamente.

## What Changes

- **Blindaje en `ResultsModal.jsx`:** Manejo defensivo para `metrics === null` o `metrics.voteCount === 0`. Se provee un valor por defecto seguro para la sugerencia inicial (`selectedScore`), evitando cualquier excepción por acceso a propiedades de `null`.
- **Estado amigable de ronda sin votos:** Si se revela la mesa sin votos numéricos registrados, el modal de resultados despliega un estado claro y amigable ("Sin votos en esta ronda"), permitiendo votar de nuevo con un clic o seleccionar una puntuación acordada.
- **Normalización de métricas en el servidor (`server/index.js`):** El servidor siempre emitirá un objeto de métricas consistente con `{ average: null, mode: null, isConsensus: false, voteCount: 0 }` en lugar de `null` cuando no haya votos numéricos válidos.
- **Sincronización reactiva en `TaskModal.jsx`:** Actualizar el texto del área de edición cuando el modal se abra o cambie la lista de tareas recibida por props.
- **Sincronización de código de sala en `Lobby.jsx`:** Reflejar reactivamente cambios en `initialRoomCode` provenientes de enlaces URL (`?room=XXXX`).
- **Pruebas de regresión automatizadas:** Incorporar en `server/test-e2e.js` la verificación de revelación de ronda con cero votos y con votos cualitativos (`☕`, `?`).

## Capabilities

### Modified Capabilities
- `round-lifecycle`: Especifica la tolerancia a fallos y despliegue amigable cuando la mesa es revelada sin votos numéricos registrados.

## Impact

- **Código Afectado:** `client/src/components/ResultsModal.jsx`, `client/src/components/TaskModal.jsx`, `client/src/components/Lobby.jsx`, `server/index.js`, `server/test-e2e.js`.
- **Dependencias:** Ninguna nueva dependencia requerida.
- **Compatibilidad:** 100% compatible hacia atrás sin cambios de API externa.
