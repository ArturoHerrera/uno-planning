# Tasks

## 1. Ajustes de Apilamiento y Separación en la Mesa

- [x] 1.1 Modificar `Room.jsx` para asignar `relative z-10` al tapete central (`poker-table-center-felt`), `relative z-20` al contenedor de jugadores y añadir separación vertical (`mt-6 sm:mt-8`), verificando que los elementos conserven su posicionamiento y diseño.
- [x] 1.2 Modificar `FlipCard.jsx` para elevar dinámicamente el contenedor de la tarjeta en hover a `z-50` (`relative ${isHovered ? 'z-50' : 'z-10'}`) y garantizar `pointer-events-auto` y `z-50` en la barra emergente de emojis, verificando que los eventos de clic alcancen los botones de reacción.

## 2. Verificación de Interacción y Build

- [x] 2.1 Ejecutar `npm run build --prefix client` para asegurar compilación limpia sin errores.
- [x] 2.2 Probar en el navegador activo que al pasar el cursor sobre la tarjeta de un compañero la barra de emojis aparece completamente despejada y que al pulsar un emoji se dispara la reacción balística sin bloqueos.
