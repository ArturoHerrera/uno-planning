# Tasks

## 1. Avatares Ricos y Variados

- [x] 1.1 Crear un utilitario o helper de avatares que soporte múltiples colecciones de Dicebear (`adventurer`, `bottts`, `avataaars`, `lorelei`) para asegurar alta variedad visual entre tiradas de dados.
- [x] 1.2 Rediseñar el botón de dados en `client/src/components/Lobby.jsx` con estilos destacados, micro-animación de giro al hacer clic y tamaño táctil ergonómico.

## 2. Universalización de Tareas y Enlaces

- [x] 2.1 En `client/src/components/TaskModal.jsx`, actualizar títulos, placeholders y descripciones retirando el acoplamiento exclusivo a Jira.
- [x] 2.2 En `client/src/components/Room.jsx`, renombrar `isJiraLink` a `isUrl` y actualizar las referencias en la columna lateral de tareas.

## 3. Mesa Redonda, Tarea Central Clickeable y Botón de Revelación

- [x] 3.1 En `client/src/index.css`, agregar estilos para el paño de mesa de casino/póker, relieve de bordes y estado deshabilitado de `.btn-uno-reveal:disabled`.
- [x] 3.2 En `client/src/components/Room.jsx`, transformar el layout central en una mesa redonda/ovalada con paño visible y jugadores sentados a su alrededor.
- [x] 3.3 En el centro del paño de la mesa en `client/src/components/Room.jsx`, alojar la tarea activa (renderizada como enlace clickeable interactivo si es URL), controles de navegación de historia y contador de votos.
- [x] 3.4 En `client/src/components/Room.jsx`, deshabilitar el botón "¡REVELAR VOTOS!" cuando no exista al menos un voto emitido en la ronda activa.

## 4. Verificación Integral

- [x] 4.1 Ejecutar pruebas E2E del backend (`node server/test-e2e.js`), compilar el cliente con Vite (`npm run build`) y verificar en navegador la mesa redonda, la interacción del link central y la aleatorización de avatares.
