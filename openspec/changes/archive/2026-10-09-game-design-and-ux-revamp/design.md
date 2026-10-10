# Design: Game Design, UX & Wording Revamp

## Context

El proyecto implementa un Poker Planning colaborativo con WebSockets (Socket.io) y React.
La arquitectura actual mantiene todo el estado de salas en memoria en Node.js (`server/index.js`), sincronizado mediante eventos de socket (`room-state-updated`, `vote`, `reveal`, `reset-round`).
Para motivar el engagement ágil sin estorbar el flujo Scrum, incorporamos la mecánica de duda (`?`), realce de discrepancias (outliers) en resultados para todos, celebración de ¡UNO! en consenso, micro-sonidos táctiles y un tutorial spotlight para anfitriones.

## Goals / Non-Goals

**Goals:**
- Sincronizar la pausa automática del temporizador y el modal prioritario de dudas (`?`) vía Socket.io.
- Desplegar el modal de resultados con métricas diferenciadas (outliers más alto vs más bajo) para todos los clientes al bajar cartas.
- Celebrar el consenso total del 100% con fanfarria armónica y efectos visuales de ¡UNO!.
- Ofrecer un tutorial spotlight con recortes visuales y micro-instrucciones concisas para hosts, persistido en `localStorage`.
- Integrar sonido sutil de colocación de carta (*card snap*) y badge "Listo" con contraste evidente frente a "Pensando...".
- Actualizar el wording hacia la temática acordada ("¡BAJAR CARTAS!", "Siguiente Mano", "Tu Mano", etc.).

**Non-Goals:**
- No implementar reglas complejas de juegos como robo de cartas ni cartas de castigo (+2/+4) que entorpezcan la agilidad laboral.
- No alterar la arquitectura efímera en memoria (no requiere base de datos persistente).
- No implementar tutoriales para participantes regulares (únicamente host onboarding).

## Decisions

### 1. Manejo y sincronización de la carta de duda (`?`)
- **Decisión:** Cuando el servidor procesa un voto con valor `'?'` en una sala, establece en el estado de la sala:
  ```json
  "activeQuestion": {
    "userId": "...",
    "userName": "...",
    "pausedTimerRemaining": 35
  }
  ```
  Si el temporizador estaba activo, se detiene y congela los segundos restantes. El cliente muestra `QuestionModal` que solo el anfitrión (o la sala) puede resolver mediante eventos `resolve-question` con opción `continue` o `reset`.
- **Alternativa descartada:** Manejar la pregunta localmente en el frontend. Se descartó porque provocaría desincronización de timers entre clientes.

### 2. Detección de Discrepancias y Outliers en Resultados
- **Decisión:** En el servidor y frontend, al calcular métricas tras la revelación, computar:
  - `minScore`: `{ value: 2, voters: ['Carlos'] }`
  - `maxScore`: `{ value: 13, voters: ['Ana'] }`
  - `isConsensus`: si todos los votantes tienen el mismo número.
  Si `minScore.value !== maxScore.value`, `ResultsModal` renderiza una tarjeta con contraste visual para abrir el debate de discrepancias. Si `isConsensus` es true, renderiza el distintivo "¡UNO! Consenso Total".
- **Alternativa descartada:** Solo mostrar el promedio y la moda tradicional. Se descartó porque no otorga visibilidad a las opiniones divergentes que son la base del debate Scrum.

### 3. Tutorial Spotlight para Anfitriones (`HostTutorial.jsx`)
- **Decisión:** Componente con overlay `fixed inset-0 bg-black/80 z-50` que calcula el `getBoundingClientRect()` del elemento objetivo según el paso activo:
  - Paso 1: widget del temporizador.
  - Paso 2: panel de la lista de tareas ("Mazo de Historias").
  - Paso 3: botón central "¡BAJAR CARTAS!".
  El elemento enfocado recibe un anillo de luz `ring-4 ring-amber-400` y z-index elevado, con un cuadro flotante de instrucciones concisas (1-2 líneas). Al terminar, escribe `poker_host_tutorial_completed = 'true'` en `localStorage`.

### 4. Paisaje Sonoro: Card Snap y Éxito ¡UNO!
- **Decisión:** Utilizar Web Audio API en `client/src/utils/sound.js` para generar sintéticamente:
  - `playCardSnap()`: Golpe seco percusivo y suave simulando carta física en paño.
  - `playUnoSuccessFanfare()`: Secuencia armónica pentatónica ascendente celebratoria.
  Evita dependencias de archivos `.mp3` pesados o problemas de CORS/latencia de red.

## Risks / Trade-offs

- **[Riesgo] Spams de cartas `?` por parte de usuarios distraídos** → *Mitigación:* Si ya hay una pregunta activa (`activeQuestion`), no se sobreescribe ni se disparan múltiples modales hasta que el anfitrión resuelva la pregunta en curso.
- **[Riesgo] Elementos no visibles en pantallas pequeñas durante el Spotlight** → *Mitigación:* `HostTutorial` ejecutará `scrollIntoView({ behavior: 'smooth', block: 'center' })` antes de calcular las coordenadas del spotlight.
