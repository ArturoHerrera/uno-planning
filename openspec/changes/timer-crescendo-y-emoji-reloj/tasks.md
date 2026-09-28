# Tasks: Mejora de Cadencia Sonora del Temporizador y Emoji de Reloj

## 1. Actualización de Catálogo de Emojis

- [x] 1.1 Actualizar el arreglo de emojis permitidos en `server/index.js` a `['🍅', '🔥', '🚀', '🎯', '🃏', '👏', '⏰', '☕']`.
- [x] 1.2 Actualizar la barra de reacciones en `client/src/components/FlipCard.jsx` con el nuevo emoji `⏰` y el `☕` al final.

## 2. Cadencia Sonora Continua y Rampa de Volumen

- [x] 2.1 Modificar `playSoftTick` en `client/src/utils/sound.js` para admitir un parámetro de intensidad y modular volumen y frecuencia sutilmente.
- [x] 2.2 Actualizar `RoundTimer.jsx` para disparar el tic cada segundo durante toda la cuenta regresiva e incrementar la intensidad en el último 25% del tiempo.

## 3. Verificación y Despliegue

- [x] 3.1 Ejecutar `npm run build` y verificar compilación local sin errores.
- [x] 3.2 Realizar commit y push a `main` para que Render realice el auto-deploy continuo y verificar en la app en vivo.
