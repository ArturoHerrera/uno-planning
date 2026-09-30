# Proposal

## Why

Para optimizar la experiencia de usuario y la dinámica de estimación ágil en UNO-Planning, se identificaron cuatro oportunidades de mejora:
1. Eliminar valores sobredimensionados (21 y 34) de la baraja para alinearse a la buena práctica Scrum de dividir épicas o tareas complejas en historias más pequeñas (máximo 13 puntos).
2. Reemplazar la asignación aleatoria de colores en las cartas por un patrón cromático ordenado y predecible (azul, verde, amarillo, rojo), logrando una estética visual armónica fiel al mazo de UNO.
3. Eliminar el sonido continuo de tic-tac por segundo del temporizador —que produce fatiga acústica y compite con la comunicación verbal del equipo—, reemplazándolo por hitos sonoros claros (inicio, 50%, cuenta regresiva en los últimos 5s y chime de cierre).
4. Evitar que los participantes y el anfitrión tengan que desplazarse manualmente (scroll) en listas largas de tareas, asegurando que la tarea activa esté siempre enfocada y visible automáticamente.

## What Changes

- **Baraja de cartas (voting-deck)**:
  - Se eliminan los valores numéricos `21` y `34` de la lista de cartas disponibles.
  - La baraja queda compuesta por `[0, 1, 2, 3, 5, 8, 13, '?', '☕']`.
  - Se sustituye la asignación aleatoria de color por la secuencia cíclica fija: Azul (`#0054A6`), Verde (`#54B948`), Amarillo (`#FFDE00`) y Rojo (`#ED1C24`). Los comodines `?` y `☕` mantienen su estilo comodín/wild.
- **Temporizador de ronda (round-timer)**:
  - Se suprime el tic-tac continuo segundo a segundo.
  - Se introduce un sonido de inicio al arrancar la cuenta regresiva.
  - Se emite un tono suave de aviso al cumplirse el 50% de la duración del temporizador.
  - Se reproducen tics suaves de cuenta regresiva en cada uno de los últimos 5 segundos (5, 4, 3, 2, 1).
  - Se mantiene el chime armónico zen al expirar el tiempo (00:00) junto con la revelación automática.
- **Cola de tareas (task-queue)**:
  - Se añade un comportamiento de auto-scroll suave (`scrollIntoView`) en el panel lateral de tareas que enfoca y sitúa la tarea activa en el área visible cada vez que cambia el índice de la tarea actual.

## Capabilities

### New Capabilities
<!-- Ninguna nueva capacidad; se refinan capacidades existentes -->

### Modified Capabilities
- `voting-deck`: Modifica la especificación de valores de baraja (elimina 21 y 34) y la asignación de colores de aleatoria a patrón cíclico (azul, verde, amarillo, rojo).
- `round-timer`: Modifica el paisaje sonoro eliminando el tic-tac continuo de cada segundo e introduciendo hitos auditivos (inicio, 50%, últimos 5 segundos y final).
- `task-queue`: Añade el requisito de auto-enfoque y visibilidad automática de la tarea activa en la lista sin scroll manual.

## Impact

- **Código afectado**:
  - `client/src/utils/deck.js`: `FIBONACCI_VALUES` y `generateRandomDeck` (renombrado o adaptado a generación con patrón secuencial).
  - `client/src/components/ResultsModal.jsx`: mapeo o referencias a valores de cartas para no mostrar 21 ni 34.
  - `client/src/utils/sound.js`: nuevos generadores con Web Audio API para tono de inicio (`playTimerStart`), tono de mitad (`playTimerMidpoint`) y ajuste de pulsos finales.
  - `client/src/components/RoundTimer.jsx`: lógica de disparo de audio por hitos temporales en lugar de cada segundo.
  - `client/src/components/Room.jsx`: `useRef` y efecto de `scrollIntoView` en el elemento de la tarea activa dentro del contenedor de cola de tareas.
- **APIs y Backend**: Sin cambios en el servidor ni protocolo Socket.io; las modificaciones son a nivel de cliente y UX.
