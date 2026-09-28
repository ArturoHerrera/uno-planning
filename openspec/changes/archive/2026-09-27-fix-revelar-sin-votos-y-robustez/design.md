# Design: Robustez en Revelación de Votos y Resiliencia en Modales

## Context

Véase `proposal.md` para la motivación. Actualmente, al invocar `round:reveal`, si `numericVotes.length === 0`, el servidor retorna `metrics: null`. En el frontend, `ResultsModal.jsx` accede a `metrics.mode` presumiendo que `metrics !== null` si `metrics?.mode !== null` (lo cual es falso para `undefined`). Además, componentes que manejan estado inicial (`TaskModal`, `Lobby`) no sincronizan props entrantes de forma reactiva.

## Goals / Non-Goals

**Goals:**
- Eliminar de raíz cualquier excepción no controlada (`TypeError`) al revelar rondas sin votos o con votos cualitativos.
- Mantener la integridad de los modales y el flujo de trabajo del anfitrión aunque la participación sea 0.
- Normalizar la respuesta del servidor con un schema consistente para `metrics`.
- Sincronizar reactivamente el estado de inputs en `TaskModal` y `Lobby`.

**Non-Goals:**
- Modificar el sistema de puntuaciones o baraja Fibonacci existente.
- Alterar la lógica de cálculo de consenso cuando sí existen votos numéricos válidos.

## Decisions

### 1. Manejo Defensivo y Estado Vacío en `ResultsModal.jsx`
- **Decisión:** Calcular `defaultSuggestion` de forma segura comprobando la existencia de `metrics`:
  ```javascript
  const defaultSuggestion = (metrics && metrics.mode != null)
    ? metrics.mode
    : ((metrics && metrics.average != null) ? Math.round(metrics.average) : 5);
  ```
- Si `!metrics || metrics.voteCount === 0`, renderizar un aviso visual contextual:
  ```jsx
  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-300 text-xs text-center font-medium">
    No se registraron votos numéricos en esta ronda. Puedes reiniciar la votación o fijar una estimación manual.
  </div>
  ```
- *Alternativas consideradas*: Ocultar el modal por completo si no hay votos. Se descartó porque el anfitrión necesita saber qué ocurrió y tener la opción de votar de nuevo o avanzar.

### 2. Normalización de `metrics` en `server/index.js`
- **Decisión:** Cuando `room.revealed` sea `true`, `metrics` siempre será un objeto estructurado:
  - Si hay votos numéricos: valores calculados normales.
  - Si no hay votos numéricos: `{ average: null, mode: null, isConsensus: false, voteCount: 0 }`.
- *Ventaja*: El frontend recibe siempre un contrato de datos predecible sin sorpresas de `null` inesperado.

### 3. Sincronización de Props en `TaskModal` y `Lobby`
- **`TaskModal`**: Agregar `useEffect` dependiente de `[isOpen, tasks]` para actualizar el `inputText` cada vez que el modal se abre o cambian las tareas en la sala.
- **`Lobby`**: Agregar `useEffect` dependiente de `[initialRoomCode]` para poblar el input si el código de sala llega asíncronamente desde la URL.

## Risks / Trade-offs

- **[Riesgo] Selección manual por defecto de 5**: Si no hay votos, sugerir 5 puntos podría inducir un sesgo si el anfitrión hace clic rápido.
  - *Mitigación*: Mostrar claramente que la ronda no tuvo votos y exigir selección consciente si el anfitrión desea guardar.
