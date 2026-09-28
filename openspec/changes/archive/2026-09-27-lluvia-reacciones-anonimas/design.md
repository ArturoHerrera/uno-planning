# Design: Lluvia de Reacciones Anónimas y Ráfagas Balísticas

## Context

Actualmente las reacciones se renderizan estáticas sobre la tarjeta del destinatario y un nuevo clic sobreescribe el anterior. Se desea rediseñar la experiencia para que los emojis se comporten como proyectiles balísticos en tiempo real que vuelan desde los bordes de la pantalla hacia la tarjeta de cualquier participante, de manera 100% anónima y permitiendo ráfagas rápidas de clics (*spam clicking*).

## Goals / Non-Goals

**Goals:**
- Proyectiles que vuelan desde posiciones perimetrales aleatorias de la pantalla hacia la tarjeta objetivo.
- Anonimato estricto: el broadcast no divulga el emisor de la reacción.
- Permitir ráfagas continuas de múltiples clics por segundo sin bloqueos de interfaz ni pérdidas de eventos.
- Impacto con animación *splat* y sacudida (*wobble*) en la tarjeta del receptor.
- Rendimiento a 60 FPS sin saturar el DOM (limpieza inmediata post-impacto).

**Non-Goals:**
- Efectos de sonido (descartados por ahora para mantener limpio el canal de audio).
- Físicas complejas 3D pesadas (se resuelve con interpolación y transformaciones CSS de alto rendimiento).

## Decisions

### 1. Capa de Proyectiles Global (`ProjectilesOverlay.jsx`)
- **Decisión**: Crear un componente overlay de pantalla completa (`fixed inset-0 pointer-events-none z-50 overflow-hidden`) montado en `Room.jsx`.
- **Estructura de proyectil**:
  ```javascript
  {
    id: string,
    emoji: string,
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    rotation: number, // Rotación inicial y giro
    duration: number  // ~450ms a 600ms
  }
  ```
- **Cálculo de origen perimetral**:
  - Se elige aleatoriamente uno de los 4 cuadrantes exteriores (`top`, `right`, `bottom`, `left`) con un margen de ±60px fuera del viewport.
- **Cálculo de destino**:
  - Se obtiene el elemento DOM `document.getElementById('card-' + targetUserId)`.
  - Se extrae el centro de su `getBoundingClientRect()`.

### 2. Anonimato en el Servidor
- En `server/index.js`, el evento `reaction:received` difunde únicamente `{ id, targetUserId, emoji }`, omitiendo cualquier referencia a `fromUserId` o `fromName`.

### 3. Soporte para Ráfagas Multi-clic
- El botón de emoji en `FlipCard.jsx` no tiene estado de *disabled* ni *cooldown* largo; cada clic dispara un nuevo evento.
- El overlay encola cada proyectil de forma independiente y programa su eliminación al concluir la animación.

## Risks / Trade-offs

- **[Riesgo] Congestión de elementos si se generan cientos de emojis simultáneos**:
  - *Mitigación*: Cada proyectil tiene un tiempo de vida estricto de 700ms máximo tras el cual se purga del estado de React.
- **[Riesgo] Redimensionamiento o scroll de ventana mientras vuela el proyectil**:
  - *Mitigación*: Las coordenadas de destino se evalúan dinámicamente en el momento del lanzamiento y el layout de la mesa se mantiene fijo sin scroll vertical principal.
