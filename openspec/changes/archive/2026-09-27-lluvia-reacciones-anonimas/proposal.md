# Proposal: Lluvia de Reacciones Anónimas y Ráfagas Balísticas

## Why

Actualmente las reacciones se muestran de forma estática sobre la tarjeta del usuario y reemplazan el estado previo con un retraso, lo cual impide la sensación de arrojar proyectiles continuos. El usuario busca transformar esta interacción en una verdadera "lluvia de emojis" cómica y dinámica, donde se puedan disparar múltiples emojis por segundo (*spam click*) y estos vuelen hacia la tarjeta de la víctima desde direcciones perimetrales aleatorias de la pantalla de forma 100% anónima, creando un ambiente lúdico y sin tensiones.

## What Changes

- **Proyectiles Balísticos Voladores en Tiempo Real**:
  - Cada reacción emitida viaja como un proyectil animado desde un borde exterior aleatorio de la pantalla (arriba, derecha, abajo o izquierda) hasta el centro de la tarjeta del participante objetivo.
  - Velocidad y trayectoria rápida en arco con ligera rotación y variación aleatoria para una apariencia orgánica.
- **Anonimato Total**:
  - Los eventos de reacción no revelan quién disparó el emoji; todos los clientes observan los proyectiles emergiendo desde los bordes de la pantalla hacia la tarjeta objetivo.
- **Soporte de Ráfagas Multi-clic (Machine Gun)**:
  - Eliminación de cualquier bloqueo o retraso en los botones de emoji: el usuario puede hacer clics repetidos rápidamente (ej. 5 a 10 clics por segundo) generando una lluvia simultánea de proyectiles cruzados.
  - Al impactar, cada proyectil ejecuta un micro-efecto *splat* de desaparición rápida y reactiva una sacudida (*wobble*) en la tarjeta receptora.
- **Sin Efectos de Sonido**:
  - Mecánica estrictamente visual para no interferir con el canal de audio de la llamada.

## Capabilities

### Modified Capabilities
- `reactions`: Se modifica el comportamiento de las reacciones para soportar proyectiles balísticos con origen perimetral anónimo, colas simultáneas de partículas voladoras y ráfagas rápidas de clics.

## Impact

- **Frontend**:
  - `Room.jsx` / `ProjectilesOverlay.jsx`: Capa de renderizado de proyectiles balísticos voladores en pantalla completa.
  - `FlipCard.jsx`: Detección de coordenadas absolutas en pantalla (`getBoundingClientRect`) y soporte para clics repetitivos inmediatos sin deshabilitar la barra hover.
  - `index.css`: Keyframes optimizadas para vuelo balístico, rotación y *splat* de impacto a 60 FPS.
- **Backend**:
  - `server/index.js`: Adaptar el broadcast de `reaction:throw` para garantizar entrega ultrarrápida sin revelar identidad del emisor.
