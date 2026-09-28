# Tasks

## 1. Backend: Difusión Anónima y Soporte de Ráfagas

- [x] 1.1 Modificar el socket handler `reaction:throw` en `server/index.js` para emitir `reaction:received` de forma anónima (sin `fromUserId` ni `fromName`) permitiendo ráfagas fluidas.

## 2. Frontend: Componente de Proyectiles y Trayectorias

- [x] 2.1 Crear el componente `client/src/components/ProjectilesOverlay.jsx` para gestionar la cola de emojis voladores desde bordes aleatorios de pantalla hacia el objetivo.
- [x] 2.2 Diseñar las animaciones CSS balísticas (vuelo con rotación e impacto *splat*) en `client/src/index.css`.

## 3. Frontend: Integración en Room y FlipCard

- [x] 3.1 Asignar identificadores DOM unívocos a las tarjetas de participantes en `client/src/components/FlipCard.jsx` y permitir clics continuos sin bloqueo en la barra de emojis.
- [x] 3.2 Montar `ProjectilesOverlay` en `client/src/components/Room.jsx` e integrar el despachador de proyectiles al recibir eventos `reaction:received`.

## 4. Verificación E2E

- [x] 4.1 Probar mediante script multi-cliente y validación en navegador la lluvia de proyectiles cruzados, anonimato y ráfagas rápidas de clics.
