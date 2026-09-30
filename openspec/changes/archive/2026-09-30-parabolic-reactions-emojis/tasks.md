# Tasks: Parabolic Projectiles & Comic Emojis Catalog

## 1. Actualización del catálogo de emojis

- [x] 1.1 Actualizar el arreglo de emojis en `client/src/components/FlipCard.jsx` con el nuevo set cómico de 9 elementos (`['☕', '🍅', '🔥', '🔪', '🧱', '💩', '💀', '👾', '⏰']`), asegurando que el café esté al inicio y el reloj al final.
- [x] 1.2 Actualizar la lista permitida en el backend (`server/index.js`) para el evento `reaction:throw`, admitiendo los 9 nuevos emojis y asignando por defecto `'☕'` si llega un emoji no reconocido.
- [x] 1.3 Actualizar la prueba de ráfaga de reacciones en `server/test-e2e.js` con el nuevo set de emojis válidos.

## 2. Física balística de tiro parabólico

- [x] 2.1 Actualizar `client/src/components/ProjectilesOverlay.jsx` calculando dinámicamente el punto medio del arco (`midX`, `midY`) con elevación proporcional a la distancia y rotación angular según la dirección del vuelo, inyectando `--mid-x`, `--mid-y`, `--rot-start`, `--rot-mid`, `--rot-end` en el estilo inline del proyectil.
- [x] 2.2 Actualizar `@keyframes projectileFlight` en `client/src/index.css` para implementar la trayectoria en arco pasando por el ápice en el 50% con escala tridimensional (`scale(1.35)`), rotación dinámica y efecto de impacto/rebote en el 85%-92%.

## 3. Validación, compilación y pruebas

- [x] 3.1 Ejecutar `npm run build` en `client/` para certificar que el bundle compila sin advertencias ni errores de sintaxis.
- [x] 3.2 Ejecutar la suite de pruebas E2E `node server/test-e2e.js` para asegurar que el flujo de reacciones y el resto del sistema funcionen al 100%.
- [x] 3.3 Validar la especificación OpenSpec ejecutando `npx openspec validate parabolic-reactions-emojis --strict`.
