# Tasks: Mejoras de UX (Favicon, Logo Home, Gestión de Usuario y Timer Zen)

## 1. Identidad Visual y Navegación

- [x] 1.1 Crear el nuevo favicon SVG temático estilo UNO en `client/public/favicon.svg` y verificar visualmente en la pestaña del navegador.
- [x] 1.2 Convertir el logo "UNO-PLANNING" del header en `client/src/components/Room.jsx` en un botón interactivo que regrese al Lobby y verificar que al hacer clic se limpie la URL y vuelva a la pantalla inicial.

## 2. Gestión de Usuario en el Lobby

- [x] 2.1 Agregar botón de borrado rápido (`X`) en el input de nombre en `client/src/components/Lobby.jsx` y verificar que borre el estado y elimine `poker_username` de `localStorage`.
- [x] 2.2 Verificar que el prellenado de nombre funcione fluidamente cuando existe una clave previa en `localStorage`.

## 3. Backend: Estado y Eventos del Temporizador

- [x] 3.1 Añadir estructura de datos del timer (`duration`, `endsAt`, `isRunning`) al estado de la sala en `server/index.js`.
- [x] 3.2 Implementar manejadores de socket para `timer:start`, `timer:pause` y `timer:reset` validando que solo el anfitrión (`isHost`) pueda emitirlos.
- [x] 3.3 Incluir el estado del timer en `getRoomPublicState` para que se propague a todos los clientes en `room:updated`.

## 4. Frontend: Componente de Timer y Paisaje Sonoro Zen

- [x] 4.1 Crear utilidad de síntesis sonora relajante en `client/src/utils/sound.js` usando Web Audio API (tic suave de madera y chime armónico tranquilo) con opción de silencio.
- [x] 4.2 Crear componente `client/src/components/RoundTimer.jsx` con controles de anfitrión (20s, 40s, 60s, 80s, play/pausa/reset), barra de progreso estilo UNO y botón de mute para el usuario.
- [x] 4.3 Integrar `RoundTimer` en `Room.jsx` y verificar sincronización en tiempo real entre múltiples pestañas.

## 5. Verificación y Despliegue

- [x] 5.1 Ejecutar `npm run build` localmente y verificar que no existan errores de compilación ni de linteo.
- [x] 5.2 Realizar commit y push a `main` para que Render realice el auto-deploy y verificar el funcionamiento en la URL pública.
