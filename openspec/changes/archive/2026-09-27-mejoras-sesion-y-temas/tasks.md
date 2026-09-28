# Tasks

## 1. Backend: Tareas con Puntuación y Eventos de Cierre

- [x] 1.1 Actualizar `server/index.js` para modelar `tasks` como objetos con `title` y `score`, e implementar el evento `task:save-score` para guardar puntos acordados y avanzar.
- [x] 1.2 Verificar el cálculo de consenso y la serialización del estado público de tareas con sus puntuaciones.

## 2. Frontend: Flujo de Cierre de Estimación & UI

- [x] 2.1 Implementar parsing automático en `client/src/components/Lobby.jsx` para extraer el código cuando se pegue una URL completa en el input de sala.
- [x] 2.2 Diseñar el botón pop "¡REVELAR VOTOS!" estilo oficial UNO en `client/src/components/Room.jsx` con elipse, borde grueso y colores icónicos.
- [x] 2.3 Implementar `client/src/components/ResultsModal.jsx` sincronizado para todos los participantes con opciones de guardado de puntos manual/automático y reinicio para el anfitrión.
- [x] 2.4 Actualizar la navegación de tareas en `Room.jsx` con botones grandes de Anterior/Siguiente y mostrar los puntos ganados en cada tarea de la columna lateral.
- [x] 2.5 Destacar el rol de `👑 Host` en la barra de usuario, lista de participantes y en la carta de la mesa.

## 3. Tema Claro y Oscuro

- [x] 3.1 Implementar switch de tema (Sol ☀️ / Luna 🌙) en `App.jsx` con persistencia en `localStorage`.
- [x] 3.2 Adaptar los estilos y gradientes en `index.css` y componentes para visualización impecable en modo claro y oscuro.

## 4. Verificación

- [x] 4.1 Ejecutar prueba E2E multi-cliente y validación en navegador del ciclo completo de votación, modal de resultados, guardado de puntos y cambio de tema.
