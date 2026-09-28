# Proposal: timer-auto-reveal

## Why

Actualmente, el temporizador de ronda marca el tiempo y emite sonidos, pero cuando la cuenta regresiva llega a 00:00 no finaliza la votación ni despliega el modal de resultados, requiriendo que el anfitrión haga clic manualmente en "¡REVELAR VOTOS!". En las dinámicas de poker planning donde se activa el temporizador, el equipo espera que al expirar el tiempo la ronda termine obligatoriamente y se revelen las cartas de forma automática.

## What Changes

- **Revelación forzada y automática en servidor:** Cuando el temporizador alcanza 00:00, el servidor concluye automáticamente la votación marcando `room.revealed = true` y deteniendo el temporizador (`isRunning = false`).
- **Apertura simultánea del modal de resultados:** Al recibirse la actualización `room.revealed = true`, todos los participantes (anfitrión y votantes) visualizan de inmediato el `ResultsModal` con el resumen de métricas y consenso, acompañado del sonido zen final.
- **Detención de timer ante revelación anticipada:** Si el anfitrión decide revelar los votos manualmente antes de que el temporizador expire, el servidor y los clientes cancelan el temporizador activo para evitar eventos redundantes o tics fuera de tiempo.
- **Cancelación segura en reinicio o pausa:** Si el temporizador es pausado o reiniciado, cualquier temporizador pendiente en el servidor se desactiva limpiamente.
- **Naturaleza opcional del temporizador:** El temporizador sigue siendo una herramienta complementaria y opcional; las salas que no utilicen temporizador continúan operando con la revelación manual habitual.

## Capabilities

### New Capabilities
<!-- Ninguna nueva capacidad -->

### Modified Capabilities
- `round-timer`: Modifica el requisito `Comportamiento no intrusivo al expirar tiempo` para convertirlo en `Revelación automática obligatoria al expirar el tiempo`, garantizando que la expiración del temporizador fuerce la revelación de cartas y la apertura del modal de resultados para todos los participantes.

## Impact

- `server/index.js`: Incorporación de `setTimeout` administrado por sala en el backend (`room.timerTimeout`) que ejecuta la auto-revelación al llegar a cero, y cancelación del mismo en `round:reveal`, `timer:pause`, `timer:reset`, `round:reset` y desconexión/cierre de sala.
- `client/src/components/RoundTimer.jsx`: Limpieza y sincronización cuando la ronda se revela externamente.
- `openspec/specs/round-timer/spec.md`: Actualización del requisito normativo sobre la expiración del reloj.
