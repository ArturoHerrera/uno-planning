# Design: Deck, Timer Sounds & Task Focus UX

## Context

Ver `proposal.md` y `specs/` para la motivación y requisitos funcionales.
La aplicación es una SPA en React con Socket.io para comunicación en tiempo real y Web Audio API para efectos sonoros libres de dependencias de archivos estáticos de audio.

## Goals / Non-Goals

**Goals:**
- Ajustar baraja a 9 cartas (`[0, 1, 2, 3, 5, 8, 13, '?', '☕']`) y garantizar que `ResultsModal` y la mano de votación reflejen esta escala.
- Asignar colores de manera cíclica (`azul`, `verde`, `amarillo`, `rojo`) a las cartas numéricas.
- Eliminar el tic-tac continuo por segundo en `RoundTimer` y disparar hitos discretos: inicio, 50%, cuenta regresiva en los últimos 5 segundos (5, 4, 3, 2, 1) y chime final en 0.
- Implementar auto-scroll suave en la cola de tareas para enfocar la tarea activa automáticamente con `scrollIntoView({ behavior: 'smooth', block: 'nearest' })`.
- Mantener todo el trabajo aislado en la rama git `feat/deck-timer-tasks-ux` para prevenir deploys automáticos prematuros en Render.

**Non-Goals:**
- Modificar el backend o el protocolo Socket.io (la lógica es 100% en cliente).
- Modificar los comodines o su comportamiento ante el cálculo de promedios.
- Reestructurar el layout general de la mesa o alterar el soporte de temas claro/oscuro.

## Decisions

### 1. Generación determinista y cíclica de cartas en `deck.js`
- **Decisión**: La baraja numérica se genera aplicando la secuencia de colores `['blue', 'green', 'yellow', 'red']` de forma cíclica (`COLOR_CYCLE[index % COLOR_CYCLE.length]`).
- **Cartas**: `FIBONACCI_VALUES = [0, 1, 2, 3, 5, 8, 13, '?', '☕']`.
- **Comodines**: `?` y `☕` mantienen su color especial `'wild'`.
- **Alternativas consideradas**:
  - *Hardcodear colores por valor*: Menos flexible si en el futuro se modifica la lista de valores.
  - *Mantener aleatorio*: Provocaba asimetría visual y repeticiones de colores adyacentes.

### 2. Síntesis Web Audio para hitos temporales en `sound.js`
- **Decisión**: Extender `sound.js` con síntesis nativa Web Audio API:
  - `playTimerStart()`: Acorde/tono ascendente de 2 notas suaves (ej. 440Hz -> 587Hz) para marcar el comienzo.
  - `playTimerMidpoint()`: Campana suave o doble tono sutil de baja amplitud al 50% del tiempo transcurrido.
  - `playSoftTick(intensity)`: Reutilizado en los últimos 5 segundos (5, 4, 3, 2, 1), incrementando la intensidad de 0.4 a 1.0.
  - `playZenChime()`: Se mantiene para la finalización en 00:00.
- **Control de estado en `RoundTimer.jsx`**:
  - Se utilizan referencias (`useRef`) para trackear hitos ya reproducidos durante la ronda activa (`startPlayedRef`, `midpointPlayedRef`, `lastCountTickRef`, `chimePlayedRef`).
  - Al pausar o reiniciar, o al comenzar una nueva ronda, se reestablecen estas referencias.
- **Alternativas consideradas**:
  - *Archivos de audio MP3/WAV*: Requieren carga de red, lidiar con paths/CORS y añaden latencia. La síntesis Web Audio es instantánea, autónoma y ligera.

### 3. Auto-scroll suave de tarea activa en `Room.jsx`
- **Decisión**: Asociar una referencia React (`activeTaskRef`) al elemento correspondiente a `roomState.currentTaskIndex` en la lista de tareas.
- Mediante un `useEffect` dependiente de `roomState.currentTaskIndex`, invocar:
  `activeTaskRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })`.
- El uso de `block: 'nearest'` garantiza que solo se desplace el contenedor interno con scroll sin producir saltos indeseados en la ventana global del navegador.
- **Alternativas consideradas**:
  - *Paginación manual*: Requiere clics adicionales y reduce la visibilidad del backlog completo.
  - *Scroll forzado al inicio*: Desubica las tareas ya completadas o pendientes inmediatas.

## Risks / Trade-offs

- **[Políticas de Autoplay de Audio en navegadores]** → Si un usuario abre la pestaña sin interactuar aún, el navegador puede suspender el `AudioContext`.
  *Mitigación*: `sound.js` ya maneja llamadas a `resume()` tras interacción de usuario y captura silenciosa de excepciones.
- **[Scroll no deseado en dispositivos móviles]** → `scrollIntoView` sin restricción de bloque podría desplazar toda la página verticalmente.
  *Mitigación*: `block: 'nearest'` restringe el ajuste de scroll al contenedor local con overflow.
- **[Disparo accidental de deploy en Render]** → Commits en `main` disparan build y deploy de producción.
  *Mitigación*: Todo el ciclo se ejecuta en la rama `feat/deck-timer-tasks-ux`.
