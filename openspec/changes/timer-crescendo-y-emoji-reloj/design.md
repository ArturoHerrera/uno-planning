# Design: Cadencia Sonora Continua y Reordenamiento de Emojis

## Context

El temporizador en `RoundTimer.jsx` solo emitía sonido cuando `remaining <= 5`. Los usuarios desean escuchar el avance rítmico del tiempo de forma continua y muy sutil desde el inicio, con un incremento dinámico en el último 25% de la cuenta regresiva. En paralelo, en `FlipCard.jsx` y `server/index.js`, la lista de emojis incluye `😂` y tiene `☕` en una posición intermedia, requiriendo su reemplazo por `⏰` y movimiento de `☕` al final.

## Goals / Non-Goals

**Goals:**
- Reproducir un tic suave de madera cada segundo durante toda la duración de la cuenta regresiva.
- Modular dinámicamente el volumen del tic: volumen base mínimo (0.015 - 0.02) durante el 75% inicial, escalando suavemente hasta un volumen moderado (0.05) en el 25% final.
- Permitir proyectar `⏰` hacia las cartas de los compañeros como recordatorio amigable de tiempo.
- Colocar `☕` al final de la barra de reacciones para simbolizar pausa.

**Non-Goals:**
- Usar sonidos de alarma o pitidos agudos estridentes.
- Modificar la duración o intervalos del temporizador en el servidor.

## Decisions

### 1. Parámetro de Intensidad en `playSoftTick(intensity = 1.0)`
- **Decisión**: Modificar `playSoftTick` en `client/src/utils/sound.js` para recibir un multiplicador de intensidad entre 0.2 y 1.0. En `RoundTimer.jsx`, calcular si el tiempo restante está dentro del último 25% (`remaining / totalDuration <= 0.25`) y escalar la intensidad proporcionalmente.
- **Alternativa descartada**: Disparar dos funciones de sonido distintas según la fase (complejiza el código innecesariamente).

### 2. Actualización de Lista de Emojis en Frontend y Backend
- **Decisión**: Mantener el arreglo estricto `['🍅', '🔥', '🚀', '🎯', '🃏', '👏', '⏰', '☕']` idéntico tanto en `server/index.js` (en el evento `reaction:throw`) como en `FlipCard.jsx`.

## Risks / Trade-offs

- **[Fatiga auditiva por sonido continuo]** → Si el tic es demasiado fuerte, puede cansar al usuario durante rondas de 80s.
  *Mitigación*: El volumen base será extremadamente sutil (un pulso casi imperceptible pero audible con audífonos), y el botón de mute sigue disponible en todo momento.
