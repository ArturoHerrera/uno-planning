# Tasks

## 1. Actualización de Baraja & Identidad

- [x] 1.1 Modificar `client/src/utils/deck.js` limitando la baraja a `0, 1, 2, 3, 5, 8, 13, 21, 34, ?, ☕` y verificar conteo de 11 cartas.
- [x] 1.2 Actualizar el branding a **UNO-PLANNING** en `Lobby.jsx`, `Room.jsx`, `index.html` y en el dorso SVG de las cartas en `UnoCard.jsx`.

## 2. Nuevo Layout en Columnas y Estilo Visual

- [x] 2.1 Actualizar `index.css` y `App.jsx` aplicando fondos con gradiente moderno profundo (`from-slate-950 via-slate-900 to-indigo-950`), eliminando bordes toscos en favor de sombras suaves y *glassmorphism*.
- [x] 2.2 Rediseñar `Room.jsx` implementando la distribución en dos columnas: columna principal 5/7 (tarea activa, mesa y baraja centrada) y columna lateral 2/7 (lista persistente de tareas con navegación).
- [x] 2.3 Ajustar dimensiones y responsividad de `UnoCard.jsx` en la mano del usuario para garantizar que las 11 cartas sean completamente visibles sin cortes ni scroll forzado.

## 3. Verificación

- [x] 3.1 Compilar y verificar visualmente en el navegador la correcta disposición en columnas, la visualización íntegra de las 11 cartas y el funcionamiento de la lista lateral de tareas.
