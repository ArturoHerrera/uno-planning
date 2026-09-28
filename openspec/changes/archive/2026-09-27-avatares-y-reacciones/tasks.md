# Tasks

## 1. Backend: Soporte de Avatares y Eventos de Reacciones

- [x] 1.1 Actualizar el modelo de participantes en `server/index.js` para recibir y almacenar `avatarSeed` en `room:create` y `room:join`.
- [x] 1.2 Implementar el socket handler `reaction:throw` en `server/index.js` con broadcast a la sala (`reaction:received`) y verificar con test automatizado.

## 2. Frontend: Generador de Avatares en Lobby y Mesa

- [x] 2.1 Implementar selector de avatar aleatorio con botón de dado (`🎲`) en `client/src/components/Lobby.jsx` con persistencia en `localStorage`.
- [x] 2.2 Mostrar el avatar circular en `FlipCard.jsx` y en la cabecera de usuario en `Room.jsx`.

## 3. Frontend: Barra Popover de Emojis y Animación de Impacto

- [x] 3.1 Crear la barra emergente de reacciones sobre `FlipCard.jsx` para participantes ajenos con el catálogo de emojis (🍅, 🔥, 🚀, 🎯, ☕, 🃏, 👏, 😂).
- [x] 3.2 Implementar animaciones CSS de impacto/splat y sacudida (*wobble*) en `index.css` y manejar la capa de proyectiles con auto-desvanecimiento en `Room.jsx`.

## 4. Verificación E2E

- [x] 4.1 Extender `server/test-e2e.js` y validar en navegador el flujo completo de avatar aleatorio y lanzamiento de reacciones en tiempo real.
