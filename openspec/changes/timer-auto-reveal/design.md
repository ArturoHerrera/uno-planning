# Design: timer-auto-reveal

## Context

Actualmente el temporizador se procesa de forma descentralizada: el servidor almacena `endsAt` y `isRunning` en el objeto `room.timer`, mientras que el cliente calcula el tiempo en un `setInterval` puramente cosmético y sonoro. Al llegar a cero, el servidor no toma ninguna acción y el cliente no despacha ningún evento de Socket.IO, dejando la sala a la espera de una acción manual del anfitrión. (Ver `proposal.md` y `specs/round-timer/spec.md`).

## Goals / Non-Goals

**Goals:**
- Autoridad completa en el servidor mediante temporizadores gestionados en memoria por sala (`room.timerTimeout`).
- Auto-revelación inmediata de votos y apertura del modal interactivo de resultados al expirar el tiempo (00:00).
- Detención y cancelación limpia de temporizadores al pausar, resetear, reiniciar ronda o revelar anticipadamente.
- Limpieza preventiva de timeouts al eliminarse una sala vacía.

**Non-Goals:**
- Forzar el uso del temporizador: sigue siendo opcional y configurable sólo si el anfitrión lo desea.
- Obligar a los participantes a votar antes de que expire el tiempo: los votos no emitidos simplemente se contabilizan como no emitidos / ausentes sin romper el flujo.

## Decisions

### 1. Temporizador con `setTimeout` gestionado en el servidor (`server/index.js`)
- **Decisión:** Al emitirse `timer:start`, el servidor calcula los milisegundos restantes (`secondsToCount * 1000`) y programa un `setTimeout`. Al vencer el tiempo, el servidor ejecuta la lógica de revelación (`room.revealed = true`, `room.timer.isRunning = false`, `room.timer.endsAt = null`, `room.timer.remainingSeconds = 0`) y emite `room:updated`.
- **Alternativa descartada:** Que el cliente del anfitrión emita `round:reveal` al llegar su contador a cero. Se descartó porque si la pestaña del anfitrión está en segundo plano o sufre ralentización/throttling de timers, la sala se quedaría congelada. El servidor garantiza sincronización estricta.

### 2. Función auxiliar `clearRoomTimer(room)`
- **Decisión:** Centralizar la cancelación del temporizador con una función `clearRoomTimer(room)` que invoque `clearTimeout(room.timerTimeout)` y limpie la referencia.
- **Invocaciones:** Se ejecutará en `round:reveal`, `timer:pause`, `timer:reset`, `round:reset` y al destruir la sala cuando se vacía.

### 3. Sincronización en el cliente (`RoundTimer.jsx` y `Room.jsx`)
- **Decisión:** Al recibir `roomState.revealed === true`, el `ResultsModal` se abre de inmediato de forma reactiva para todos los clientes (anfitrión y participantes). En `RoundTimer.jsx`, si la ronda se revela o el timer deja de correr, se cancelan los tics y se emite el chime si no se había emitido aún.

## Risks / Trade-offs

- **[Riesgo] Fugas de memoria si los timeouts quedan huérfanos al vaciarse la sala** → *Mitigación:* Se añade `clearRoomTimer(room)` en el bloque de desconexión cuando `room.participants.length === 0` y se borra la sala con `rooms.delete(roomId)`.
- **[Riesgo] Carrera entre revelación manual del anfitrión y vencimiento del timer en el mismo segundo** → *Mitigación:* `round:reveal` llama inmediatamente a `clearRoomTimer(room)` antes de emitir, evitando que el callback del timeout ejecute una segunda revelación.
