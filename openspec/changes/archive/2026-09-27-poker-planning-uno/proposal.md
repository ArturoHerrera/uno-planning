# Proposal

## Why

Las herramientas de Poker Planning convencionales suelen requerir inicios de sesión complejos, configuraciones engorrosas y están sobrecargadas de opciones, lo que ralentiza las ceremonias de refinamiento ágil. Este proyecto busca ofrecer una herramienta de estimación de Poker Planning web ultra-ligera, minimalista y elegante, con una estética lúdica inspirada en el juego clásico de cartas UNO, con entrada sin fricción (cero registro complejo) y con sincronización en tiempo real 100% efímera en memoria.

## What Changes

- **Salas de Estimación Efímeras en Tiempo Real**: Creación y unión a salas mediante código/URL compartible utilizando Node.js y Socket.io sin necesidad de base de datos persistente.
- **Identidad Ligera con Persistencia Local**: Los usuarios se identifican únicamente con su nombre, recordado entre sesiones vía `localStorage`.
- **Baraja Fibonacci Estilo UNO con Colores Dinámicos**:
  - Valores: `0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89`, junto a cartas especiales `?` (Wild / Duda) y `☕` (Wild Draw / Pausa).
  - Estética vectorial inspirada en el mazo oficial de UNO (óvalo inclinado, números en esquina y centro, y distribución aleatoria de los 4 colores clásicos: rojo, azul, verde y amarillo).
  - Reverso unificado con dorso "POKER" para mantener oculto el voto en la mesa hasta la revelación.
- **Gestión de Tareas y Enlaces de Jira**: El anfitrión puede cargar una o varias URLs de tareas (ej. Jira), destacando la tarea en curso y permitiendo a todos los participantes hacer clic para ver sus detalles.
- **Roles y Modo Espectador**: Los participantes pueden alternar al modo espectador para participar en la sesión sin votar ni alterar promedios/consensos.
- **Control de Ronda**: El anfitrión puede revelar votos con animación de volteo (flip 3D), visualización de promedio/consenso y reinicio de la ronda para la siguiente tarea.
- **Arquitectura Fullstack Monolito Ligero**: Empaquetado para despliegue sin costos en Render.com (Free Tier).

## Capabilities

### New Capabilities
- `room-management`: Creación de salas efímeras, control de anfitrión, gestión de participantes y estado de conexión vía Socket.io.
- `voting-deck`: Baraja Fibonacci con cartas vectoriales estilo UNO, selección aleatoria de colores, soporte para comodines (`?`, `☕`) y modo espectador.
- `task-queue`: Entrada y navegación de lista de enlaces/tareas de Jira accesibles por los participantes.
- `round-lifecycle`: Flujo de votación (oculto, revelación simultánea con animación flip 3D, cálculo de consenso/promedio y reinicio).

### Modified Capabilities
<!-- None -->

## Impact

- **Código y Dependencias**:
  - Backend: Node.js, Express, Socket.io, `cors`.
  - Frontend: React 19, Vite, Lucide Icons, Canvas Confetti (para consenso unánime).
- **Despliegue e Infraestructura**: Servidor único Node sirviendo los assets estáticos de Vite y el servidor de WebSockets, preparado para Render.com ($0.00 / sin tarjeta).
