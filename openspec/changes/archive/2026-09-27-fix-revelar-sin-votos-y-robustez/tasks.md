# Tasks

## 1. Backend: Normalización de Métricas y Manejo de Rondas Vacías

- [x] 1.1 En `server/index.js`, asegurar que `getRoomPublicState` siempre retorne un objeto de métricas estructurado `{ average: null, mode: null, isConsensus: false, voteCount: 0 }` al revelar una ronda sin votos numéricos.
- [x] 1.2 Actualizar `server/test-e2e.js` para simular y validar que la revelación de ronda con 0 votos y con votos cualitativos (`☕`, `?`) no provoca excepciones y entrega el esquema normalizado.

## 2. Frontend: Blindaje de Modales y Sincronización Reactiva

- [x] 2.1 En `client/src/components/ResultsModal.jsx`, blindar `defaultSuggestion` ante `metrics === null` o `undefined`, y mostrar un mensaje claro cuando `voteCount === 0`.
- [x] 2.2 En `client/src/components/TaskModal.jsx`, agregar `useEffect` para sincronizar `inputText` al abrirse el modal o al cambiar la lista de tareas recibida por props.
- [x] 2.3 En `client/src/components/Lobby.jsx`, agregar `useEffect` para sincronizar reactivamente `roomCode` cuando `initialRoomCode` provenga de la URL.

## 3. Verificación Integral

- [x] 3.1 Ejecutar pruebas E2E (`node server/test-e2e.js`), compilar el cliente con Vite (`npm run build`) y validar en navegador que presionar "¡REVELAR VOTOS!" sin votos no rompe la aplicación.
