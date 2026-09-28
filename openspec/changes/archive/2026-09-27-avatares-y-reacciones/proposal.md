# Proposal: Avatares Dinámicos y Reacciones Lúdicas

## Why

Para aumentar el dinamismo, engagement y diversión durante las llamadas de estimación ágil (poker planning), los participantes necesitan una representación visual personalizada (avatares con expresiones) y una forma lúdica y amigable de interactuar en tiempo real aventando reacciones (emojis con impacto visual) a otros compañeros en la mesa sin interrumpir la llamada ni el flujo formal de votación.

## What Changes

- **Avatares Aleatorios con Cara Propia**:
  - Generación de avatares vía DiceBear SVG (`fun-emoji` o `bottts`) sin dependencias pesadas en el bundle.
  - Generación inicial aleatoria en el Lobby con botón 🎲 para cambiar de cara antes de unirse.
  - Persistencia de la semilla (`avatarSeed`) en `localStorage` y en el estado del participante en memoria.
  - Visualización del avatar en el Lobby, en la tarjeta de votación sobre la mesa (`FlipCard`) y en la barra superior.
- **Lanzamiento de Reacciones (Emojis Flotantes)**:
  - Al pasar el cursor (hover) sobre la tarjeta/avatar de cualquier otro participante en la mesa, aparece una barra emergente con emojis divertidos (🍅 Tomate, 🔥 Fuego, 🚀 Cohete, 🎯 Diana, ☕ Café, 🃏 Carta UNO, 👏 Aplauso, 😂 Risa).
  - Al hacer clic en un emoji, se emite un evento en tiempo real `reaction:throw`.
  - Animación compartida para todos los miembros de la sala: el emoji impacta sobre la tarjeta del usuario receptor con efecto *wobble* (sacudida) y partículas/salpicadura que se desvanecen automáticamente a los 2 segundos.
  - 100% efímero en memoria (cero base de datos).

## Capabilities

### New Capabilities
- `reactions`: Gestión y broadcast en tiempo real de reacciones lúdicas (emojis con animación de impacto) dirigidas entre participantes de una sala.

### Modified Capabilities
- `room-management`: Incorporación de avatar visual personalizable (`avatarSeed`) en la identidad del participante, persistido localmente y sincronizado en la sala.

## Impact

- **Frontend**:
  - `Lobby.jsx`: Selector/generador de avatar y vista previa.
  - `FlipCard.jsx`: Avatar visible sobre cada carta y barra hover con emojis disponibles.
  - `Room.jsx`: Capa de animación para renderizar reacciones entrantes y su desvanecimiento.
  - `App.jsx`: Manejo de listeners de reacciones e inicialización del seed de avatar.
- **Backend**:
  - `server/index.js`: Propiedad `avatarSeed` en participantes y nuevo evento Socket.io `reaction:throw` -> `reaction:received`.
