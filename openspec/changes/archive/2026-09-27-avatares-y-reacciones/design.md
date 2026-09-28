# Design: Avatares Dinámicos y Reacciones Lúdicas

## Context

La aplicación cuenta con una mesa de cartas 3D y lista de participantes efímera. Para dotarla de mayor dinamismo y engagement lúdico en reuniones, se introducen avatares generados por API sin costo y un sistema de proyectiles de emojis interactivos por Socket.io.

## Goals / Non-Goals

**Goals:**
- Generar avatares vectoriales divertidos sin recargar el bundle con librerías pesadas.
- Permitir regenerar la cara en el Lobby con un clic (`🎲`) y recordarla en `localStorage`.
- Desplegar una barra de reacciones (popover hover) sobre las cartas de los demás participantes.
- Transmitir las reacciones en tiempo real a todos los clientes y reproducir una animación de impacto y sacudida.
- Limpiar los efectos automáticamente a los 2 segundos sin persistencia en el servidor.

**Non-Goals:**
- Cambiar de avatar dentro de la sala (decisión de UX: se fija al entrar para mantener consistencia visual).
- Emojis ofensivos o no consensuados (se limita estrictamente al catálogo lúdico aprobado).
- Almacenamiento en base de datos.

## Decisions

### 1. Motor de Avatares: DiceBear SVG (`fun-emoji`)
- **Decisión**: Utilizar la API abierta de DiceBear: `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${avatarSeed}`.
- **Razón**: Es 100% gratuita, ultrarrápida, entrega SVG vectorial escalable y no requiere ninguna librería externa en el bundle.
- **Alternativas consideradas**:
  - *Generador SVG propio*: Mayor complejidad y variedad limitada de caras.
  - *Librería npm*: Agregaría 500kB+ al tamaño de la app.

### 2. Ciclo de Vida del Avatar
- Inicialización en `Lobby.jsx`: Se lee `localStorage.getItem('poker_avatar_seed')` o se genera una cadena aleatoria `Math.random().toString(36).substring(2, 8)`.
- El botón de dado (`🎲`) genera un nuevo seed aleatorio.
- El `avatarSeed` viaja en los payloads de `room:create` y `room:join`.
- Cada participante en `server/index.js` almacena su `avatarSeed`.

### 3. Mecánica de Reacciones (Emoji Throwing)
- **Activación**: Hover sobre el componente [FlipCard.jsx](file:///home/josear/dev/poker-planning/client/src/components/FlipCard.jsx) únicamente para participantes distintos al usuario actual (`p.id !== currentUserId`).
- **Catálogo Seguro**: `['🍅', '🔥', '🚀', '🎯', '☕', '🃏', '👏', '😂']`.
- **Canal Socket.io**:
  - Cliente emite: `socket.emit('reaction:throw', { targetUserId, emoji })`.
  - Servidor emite a la sala: `io.to(roomId).emit('reaction:received', { id, fromUserId, targetUserId, emoji })`.
- **Efecto Visual**:
  - En la tarjeta receptora, un elemento flotante muestra el emoji grande con animación `splat` o `bounce` y sacudida de la carta (`wobble`).
  - Auto-limpieza a los 2000ms mediante un temporizador local.

## Risks / Trade-offs

- **[Riesgo] Spam de emojis por parte de un usuario**:
  - *Mitigación*: Throttling en cliente (por ejemplo, máximo 1 reacción cada 500ms por usuario) para evitar saturar el canvas o el socket.
- **[Riesgo] Bloqueo de red a DiceBear API**:
  - *Mitigación*: En caso de fallo de carga de la imagen del avatar, mostrar como fallback las iniciales del nombre con fondo de color UNO.
