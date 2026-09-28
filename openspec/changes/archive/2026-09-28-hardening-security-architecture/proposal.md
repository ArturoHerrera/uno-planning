# Proposal: Hardening de Ciberseguridad y Arquitectura de Sistemas

## Why

El análisis de seguridad y arquitectura reveló fallos críticos que amenazan la estabilidad en producción: colisión destructiva de salas en memoria por generación pseudoaleatoria predecible (`Math.random`), un fallo en React 19 (*Rules of Hooks*) que crashea el modal de resultados, pérdida permanente de privilegios del anfitrión ante reconexiones o recargas (F5), vulnerabilidad a DoS por memoria no acotada (creación masiva de salas, tareas kilométricas y flooding de reacciones) y falta de cabeceras de seguridad HTTP básicas. Este cambio blinda la aplicación antes del despliegue en producción.

## What Changes

- **Generador de IDs de sala criptográfico y anti-colisión:** Reemplazo de `Math.random` por generador seguro (`crypto.randomBytes`) y validación estricta de no existencia previa en memoria.
- **Protección de sesión y persistencia de rol de anfitrión (Host Token):** Generación de token criptográfico de anfitrión devuelto al crear la sala, almacenado en `sessionStorage` para restaurar permisos en caso de recarga o reconexión de socket.
- **Corrección de Rules of Hooks en React 19:** Reordenamiento incondicional de los hooks `useState` y `useEffect` en `ResultsModal.jsx` para evitar crashes en tiempo de ejecución.
- **Auto-reconexión resiliente en el cliente:** Gestión del evento `connect` en `App.jsx` para reincorporar automáticamente al usuario a su sala activa sin perder estado ni quedar huérfano.
- **Defensa contra DoS y Rate Limiting:**
  - Límite máximo de participantes por sala (max 30).
  - Límite máximo de tareas y longitud de títulos (max 50 tareas, max 300 caracteres por tarea).
  - Rate limiting en eventos de Socket.io (max 5 reacciones/segundo por usuario).
  - Limpiador automático (*TTL Janitor*) para purgar salas inactivas tras 8 horas.
- **Validación y tipado estricto de votos:** Whitelist rigurosa de cartas de la baraja UNO (`[0, 1, 2, 3, 5, 8, 13, 20, 40, 100, '?', '☕']`), rechazando `NaN`, `Infinity` y valores maliciosos.
- **Cabeceras HTTP de seguridad:** Incorporación de `helmet` con CSP, `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN` y deshabilitación de `X-Powered-By`.
- **Suite de pruebas de seguridad y estrés:** Nuevas pruebas automatizadas en `server/test-security.js` para validar anti-colisión, inyecciones, rate-limiting y reconexión.

## Capabilities

### Modified Capabilities
- `room-management`: Incorpora requerimientos de generación criptográfica anti-colisión, token de sesión de anfitrión para supervivencia a reconexiones, auto-rejoin de participantes, límites de participantes y recolección de salas zombi.
- `round-lifecycle`: Incorpora requerimientos de validación estricta de valores de votación (anti-envenenamiento numérico) y cuotas máximas para listas de tareas.

## Impact

- **Servidor:** [`server/index.js`](file:///home/josear/dev/poker-planning/server/index.js) añade `helmet` y utilidades de saneamiento, validación y rate limiting.
- **Cliente:** [`client/src/components/ResultsModal.jsx`](file:///home/josear/dev/poker-planning/client/src/components/ResultsModal.jsx), [`client/src/App.jsx`](file:///home/josear/dev/poker-planning/client/src/App.jsx) y sincronización de sesión con `sessionStorage`.
- **Dependencias:** Incorporación de `helmet` en `dependencies` de [`package.json`](file:///home/josear/dev/poker-planning/package.json).
- **Pruebas:** Nuevo script `server/test-security.js` y script npm `test:security`.
