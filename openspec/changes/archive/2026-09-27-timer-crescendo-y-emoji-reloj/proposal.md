# Proposal: Mejora de Cadencia Sonora del Temporizador y Emoji de Reloj

## Why

El temporizador actual permanecía en silencio durante la mayor parte de la cuenta regresiva y solo emitía sonidos en los últimos 5 segundos, lo cual no transmitía de forma continua la sensación de tiempo transcurriendo. Asimismo, los participantes necesitan una reacción rápida y visual ("⏰") para animar a un compañero a votar cuando se está quedando sin tiempo, reservando el emoji del café ("☕") para el final de la barra como señal de pausa o descanso.

## What Changes

1. **Cadencia Sonora Continua con Rampa al 25%**:
   - Sonido de tic sutil y relajante (estilo madera/gota) emitido cada segundo durante toda la cuenta regresiva.
   - En el último 25% del tiempo total de la ronda (ej. últimos 15s de 60s, o 5s de 20s), el volumen aumenta de forma progresiva y elegante, culminando con el chime armónico zen al llegar a cero.
2. **Reemplazo y Reordenamiento de Emojis de Reacción**:
   - Reemplazo del emoji de risa (`😂`) por el emoji de reloj despertador (`⏰`).
   - Reordenamiento de la barra de emojis para colocar el cafecito (`☕`) al final:
     `['🍅', '🔥', '🚀', '🎯', '🃏', '👏', '⏰', '☕']`.
   - Validación sincronizada en el backend (`server/index.js`) y en el componente de interfaz (`FlipCard.jsx`).

## Capabilities

### Modified Capabilities
- `round-timer`: Actualización del paisaje sonoro para emitir tics continuos cada segundo con rampa de volumen suave en el último cuarto del tiempo.
- `reactions`: Sustitución del emoji de risa por el de reloj y reordenamiento del catálogo con el café al final.

## Impact

- **Frontend**: Componentes `RoundTimer.jsx`, `FlipCard.jsx` y utilidad de sonido `sound.js`.
- **Backend**: Arreglo `allowedEmojis` en `server/index.js` para aceptar `⏰` y el nuevo orden.
