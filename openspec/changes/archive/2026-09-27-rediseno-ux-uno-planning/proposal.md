# Proposal: Rediseño UX UNO-PLANNING

## Why

La experiencia de usuario inicial presentaba desbordamiento y corte en la barra de cartas inferior en pantallas de escritorio, valores innecesariamente altos en la baraja Fibonacci (55 y 89), y una visualización de tareas en un modal aislado. Además, se requiere renombrar la aplicación formalmente a **UNO-PLANNING** y modernizar su estilo visual mediante gradientes ambientales, elevación por espacios y sombras suaves, eliminando bordes duros y dividiendo la pantalla en dos columnas dedicadas (70% mesa y votación / 30% lista persistente de tareas).

## What Changes

- **Renombrar Producto a UNO-PLANNING**: Actualización de títulos, textos de dorso y branding a UNO-PLANNING.
- **Topar Escala Fibonacci en 34**: La baraja se limita a `0, 1, 2, 3, 5, 8, 13, 21, 34, ?, ☕` (11 cartas en total), eliminando 55 y 89 para promover el desglose de tareas gigantes.
- **Barra de Cartas Responsiva y Visible**: Ajuste de dimensiones de cartas en la mano para que todas quepan en una sola fila centrada y visible sin scrollbar horizontal molesta ni recortes.
- **Layout en Dos Columnas (5/7 vs 2/7)**:
  - Columna principal (~70%): Tarea activa destacada, mesa de votación con cartas 3D y baraja de votación inferior.
  - Columna lateral (~30%): Panel persistente de lista de tareas de Jira, con enlaces clickables directos y selección ágil por el anfitrión.
- **Estética Moderna de Espacios y Gradientes**:
  - Fondo enriquecido con degradados oscuros (*deep mesh gradients*).
  - Eliminación de bordes duros (`border`) en favor de elevación suave, *glassmorphism* y espacios generosos.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `voting-deck`: Redefinición de la baraja para limitar el valor máximo a 34 y ajustar el renderizado de la mano sin desbordamiento.
- `task-queue`: Integración de la lista de tareas en un panel de columna lateral fija y persistente en la interfaz en lugar de únicamente un modal flotante.

## Impact

- **Frontend**: Componentes `App.jsx`, `Room.jsx`, `UnoCard.jsx`, `deck.js`, `Lobby.jsx` e `index.css`.
- **Backend**: Sin cambios en el protocolo de Socket.io (compatible al 100%).
