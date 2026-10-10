# Proposal

## Why

El formulario de entrada y registro inicial en el Lobby presenta redundancia de controles (dos botones diferentes que realizan la misma acción de aleatorizar avatar), desalineación en la ubicación del toggle del tutorial de anfitrión (que confunde a quienes solo vienen a unirse a una sesión) y carece de un control global de tema claro/oscuro antes de entrar a la sala. Esto obliga a usuarios que prefieren modo claro a interactuar con un lobby oscuro hasta que la sala carga.

Optimizar la jerarquía del Lobby unificará la identidad del jugador, reducirá la carga cognitiva y brindará soporte de tema consistente desde el primer segundo.

## What Changes

- **Control global de tema en el Lobby**: Se agrega un botón interactivo para alternar entre modo claro y oscuro (`☀️ / 🌙`) en la esquina superior derecha (`top-4 right-4`) de la vista del Lobby, sincronizado con el tema global de la app y persistente en `localStorage`.
- **Eliminación de redundancia de avatares**: Se retira el botón textual `[Cambiar estilo]` junto a la etiqueta del nombre. Se mantiene exclusivamente el botón con ícono de dados (`🎲`) integrado en la esquina del avatar con micro-animación de rotación activa.
- **Reubicación contextual del Tutorial de Anfitrión**: El switch del tutorial para Scrum Master se mueve directamente debajo de la acción "Crear Nueva Sala", vinculándolo de forma explícita al acto de creación y liberando la vista para quienes solo desean ingresar un código y unirse.
- **Pulido estético y adaptación de temas**: Se adapta la tarjeta central, los fondos decorativos y los botones para responder armónicamente tanto en modo oscuro como en modo claro.

## Capabilities

### Modified Capabilities
- `theme-management`: Extender la capacidad para que el tema visual pueda ser alternado y visualizado activamente desde el Lobby inicial antes de unirse o crear una sala.
- `host-onboarding`: Ajustar el requerimiento de presentación del toggle de tutorial para estar contextualizado específicamente en la sección de creación de sala del Lobby.

## Impact

- Modificación de [Lobby.jsx](file:///home/josear/dev/poker-planning/client/src/components/Lobby.jsx) para recibir `theme` y `onToggleTheme`, reordenar controles y limpiar redundancias.
- Modificación de [App.jsx](file:///home/josear/dev/poker-planning/client/src/App.jsx) para pasar las props del tema al componente `Lobby`.
- Ajustes de estilos en modo claro para el Lobby en [index.css](file:///home/josear/dev/poker-planning/client/src/index.css) o clases utilitarias de Tailwind.
