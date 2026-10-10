# Tasks

## 1. Conexión de Estado de Tema a Lobby

- [x] 1.1 Pasar props de `theme` y `onToggleTheme` desde `App.jsx` al componente `Lobby` y verificar que el componente las recibe sin romper la inicialización.
- [x] 1.2 Agregar el botón de alternancia de tema (Sol/Luna) en la esquina superior derecha del `Lobby` (`top-4 right-4`) y verificar que al hacer clic cambia el estado global y se refleja en el body.

## 2. Optimización de UX y Limpieza de Redundancias en Lobby

- [x] 2.1 Eliminar el botón textual `[Cambiar estilo]` junto a la etiqueta del nombre de usuario y verificar que el avatar conserva su botón flotante de dados (`🎲`) como único control con animación de rotación.
- [x] 2.2 Reubicar el toggle de "Tutorial de Anfitrión" inmediatamente debajo del botón principal "Crear Nueva Sala" con un diseño secundario más compacto y verificar que no interfiere con el flujo de unirse a una sala.

## 3. Adaptación Estética de Temas en Lobby

- [x] 3.1 Implementar soporte para modo claro en el `Lobby` (fondo, tarjeta central, inputs, textos y footer) y verificar que en ambos modos (claro y oscuro) los textos tienen alto contraste y legibilidad.
- [x] 3.2 Verificar en el navegador mediante build o ejecución de pruebas que la navegación de entrada y creación/unión de sala funciona fluidamente en ambos temas.
