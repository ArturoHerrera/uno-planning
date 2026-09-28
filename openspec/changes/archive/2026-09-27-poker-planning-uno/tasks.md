# Tasks

## 1. Project Scaffolding & Server Foundation

- [x] 1.1 Configurar estructura del monorepo ligero con `package.json` raíz, scripts de build y dependencias (`express`, `socket.io`, `cors`, `vite`, `react`) y verificar que `npm install` se complete sin errores.
- [x] 1.2 Implementar el servidor Express con Socket.io en `server/index.js` gestionando el ciclo de vida de salas en memoria (`Map`), soporte de reconexión y servicio estático del frontend en producción, verificando arranque local en puerto configurable.

## 2. Real-Time Room & Session Engine

- [x] 2.1 Implementar protocolo de eventos Socket.io para salas (`room:create`, `room:join`, `room:leave`, `disconnect`) con auto-limpieza cuando la sala quede vacía y verificar mediante prueba de conexión multi-cliente.
- [x] 2.2 Implementar gestión de cola de tareas de Jira (`task:set-list`, `task:select`, `task:next`, `task:prev`) sincronizando el enlace activo para todos los participantes.
- [x] 2.3 Implementar ciclo de vida de votación (`vote:cast`, `vote:toggle-spectator`, `round:reveal`, `round:reset`) con cálculo en memoria de promedio numérico, consenso y moda.

## 3. UI/UX & Componentes de Cartas estilo UNO

- [x] 3.1 Diseñar el componente SVG/CSS para la carta de estimación con la geometría fiel de UNO (óvalo inclinado, números en esquina, borde redondeado y dorso "POKER"), verificando su renderizado nítido en navegador.
- [x] 3.2 Implementar generador de baraja Fibonacci (`0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, ?, ☕`) con asignación aleatoria entre los 4 colores clásicos de UNO (rojo, azul, verde, amarillo) y cartas comodín.
- [x] 3.3 Implementar componente de carta 3D con animación de volteo (*flip 3D*) al revelar la mesa y animación elástica en la mano del usuario.

## 4. Vistas y Flujos de Usuario

- [x] 4.1 Implementar pantalla de inicio (*Lobby*) con persistencia de nombre en `localStorage`, creación de sala y unión por código o URL con validación visual.
- [x] 4.2 Implementar vista de la Sala (*Poker Table*): panel de tarea activa de Jira con enlace clickable, mesa con cartas de participantes (con estados de pensando/votado/espectador) y controles de anfitrión.
- [x] 4.3 Implementar modal/panel de carga de tareas en lote (pegar lista de URLs de Jira) y barra de navegación de tareas para el anfitrión.
- [x] 4.4 Integrar panel de métricas de consenso tras la revelación (promedio, consenso y animación de confeti si hay acuerdo unánime).

## 5. Build, Verificación & Despliegue en Render

- [x] 5.1 Configurar script de build unificado (`npm run build` para compilar el cliente Vite e integrarlo en la carpeta pública del servidor Express).
- [x] 5.2 Realizar prueba de extremo a extremo simulando múltiples pestañas con anfitrión, votantes y espectador, verificando la sincronización en tiempo real y el flujo completo de votación y tareas.
- [x] 5.3 Crear archivo de configuración y documentación para despliegue en Render.com (`render.yaml` o instrucciones de despliegue Free Tier sin tarjeta de crédito).
