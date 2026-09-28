# Proposal: Mejoras de Sesión y Temas

## Why

Durante sesiones reales de refinamiento ágil, los equipos necesitan flujos de trabajo claros para cerrar estimaciones: un modal interactivo donde el anfitrión pueda consolidar el puntaje acordado en la llamada y guardarlo en el backlog de la sesión. Asimismo, se detectaron fricciones en la entrada de códigos (al pegar la URL completa copiada), botones de navegación poco notorios, falta de énfasis en el rol de anfitrión/participante y ausencia de soporte para tema claro/oscuro.

## What Changes

- **Parsing inteligente al pegar código de sala**: Si el usuario pega una URL completa en el input de código de la sala en el Lobby (ej. `http://.../?room=CGTPC9`), se extrae automáticamente el código limpio (`CGTPC9`).
- **Botón de Revelar estilo botón oficial UNO**: Rediseño con geometría ovalada inclinada, rojo vibrante `#ED1C24`, borde blanco grueso, tipografía pop en amarillo y sombra 3D proyectada.
- **Navegación de Tareas prominente**: Botones amplios y visibles `[ ◄ Anterior ]` y `[ Siguiente ► ]` con indicador de progreso `Tarea X de Y`.
- **Modal de Resultados & Asignación de Puntos**:
  - Al revelar votos, se abre un modal para todos los participantes con promedio, moda, desglose de votos y confeti en consenso.
  - El anfitrión puede:
    1. Guardar el puntaje sugerido o seleccionar un valor manual acordado en la llamada.
    2. Reiniciar la votación de la misma tarea si no hubo acuerdo.
    3. Guardar y avanzar a la siguiente tarea.
- **Puntuaciones reflejadas en la Cola de Tareas**: Cada ticket en la lista lateral muestra su puntaje final asignado (ej. `5 pts`).
- **Claridad de Roles**: Identificación destacada de `👑 Host` en la barra superior, en la lista de participantes y en la tarjeta de la mesa.
- **Soporte de Tema Claro y Oscuro**: Switch de sol/luna con persistencia en `localStorage` y gradientes adaptados para ambos modos.

## Capabilities

### New Capabilities
- `theme-management`: Soporte para alternar y persistir modos claro y oscuro en toda la aplicación.

### Modified Capabilities
- `task-queue`: Registro de puntos acordados por tarea y controles ampliados de navegación anterior/siguiente.
- `round-lifecycle`: Modal interactivo sincronizado de cierre de estimación con asignación de puntuación por el anfitrión y reinicio selectivo.
- `room-management`: Extracción inteligente de código desde URL y distinción visual prominente del rol de anfitrión.

## Impact

- **Backend**: Eventos adicionales para guardar estimación (`task:save-score`) y persistir el objeto `{ text: string, score: number | string | null }` en el estado en memoria de la sala.
- **Frontend**: Componentes `Room.jsx`, `Lobby.jsx`, `FlipCard.jsx`, `TaskModal.jsx`, `ResultsModal.jsx` y estilos globales en `index.css`.
