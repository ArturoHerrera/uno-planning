# Design: Parabolic Projectiles & Comic Emojis Catalog

## Context

Ver `proposal.md` y `specs/reactions/spec.md` para la justificación del cambio y los requerimientos funcionales.
Actualmente el sistema de reacciones efímeras (`ProjectilesOverlay.jsx` e `index.css`) dibuja proyectiles que vuelan en línea recta entre el borde y la tarjeta destinataria, con una lista de emojis más genérica (`🍅`, `🔥`, `🚀`, `🎯`, `🃏`, `👏`, `⏰`, `☕`).
El objetivo es elevar la experiencia cómica y lúdica del equipo en el poker planning mediante una física de tiro parabólico balístico y un catálogo de emojis irreverentes y divertidos para programadores.

## Goals / Non-Goals

**Goals:**
- Actualizar el catálogo de emojis a 9 opciones cómicas: `['☕', '🍅', '🔥', '🔪', '🧱', '💩', '💀', '👾', '⏰']`, garantizando que el café (`☕`) lidere la barra de selección.
- Sincronizar la validación de emojis en el servidor (`server/index.js`) y las suites de prueba (`server/test-e2e.js`) para admitir el nuevo set sin degradar la seguridad.
- Dotar a los proyectiles de una trayectoria balística parabólica (arco dinámico con elevación intermedia en Y) utilizando variables CSS calculadas en JS (`--start-x`, `--start-y`, `--mid-x`, `--mid-y`, `--end-x`, `--end-y`).
- Añadir sensación física tridimensional: escala reducida al despegar (`scale(0.4)`), máxima escala en el ápice (`scale(1.35)`), aceleración hacia el impacto con contracción y rebote antes de disolverse.
- Añadir rotación angular durante el vuelo para que cuchillos, ladrillos y proyectiles giren mientras vuelan.
- Mantener todo el trabajo aislado en la rama git `feat/parabolic-reactions-emojis` y validar exhaustivamente con OpenSpec y pruebas E2E.

**Non-Goals:**
- Modificar el sistema de anonimato o la estructura del payload del evento `reaction:throw`.
- Alterar la lógica de cálculo de posiciones relativas de las tarjetas en la mesa (`getBoundingClientRect`).
- Añadir bibliotecas pesadas de física (como Matter.js o Three.js); la animación debe ejecutarse nativamente mediante CSS acelerado por GPU.

## Decisions

### 1. Catálogo unificado y orden estricto de emojis
- **Decisión**: Los emojis permitidos serán exactamente 9: `['☕', '🍅', '🔥', '🔪', '🧱', '💩', '💀', '👾', '⏰']`.
- **Ubicación en Frontend**: `client/src/components/FlipCard.jsx` expone esta lista al usuario en la barra emergente flotante sobre las tarjetas.
- **Ubicación en Backend**: `server/index.js` restringe el evento `reaction:throw` al mismo conjunto; si el emoji no pertenece a la lista, se asigna por defecto el primer emoji permitido.
- **Alternativas consideradas**:
  - *Permitir emojis arbitrarios*: Podría desbalancear el diseño de la barra emergente o introducir caracteres visualmente incompatibles.
  - *Mantener iconos viejos*: Desperdiciaba el espacio disponible y no cumplía con el tono cómico deseado por el equipo.

### 2. Física balística de tiro parabólico en `ProjectilesOverlay.jsx` e `index.css`
- **Decisión**: El cálculo del arco se resuelve determinando un vértice intermedio (`midX`, `midY`) para cada proyectil lanzado:
  - $midX = (startX + endX) / 2$
  - Distancia euclidiana $D = \sqrt{(endX - startX)^2 + (endY - startY)^2}$
  - Altura de arco: $arcHeight = \text{clamp}(120, D \times 0.28, 260) + \text{jitter}(15)$
  - $midY = \min(startY, endY) - arcHeight$ (acotado a un mínimo de 15px sobre el viewport para evitar que el emoji se recorte en la parte superior).
  - Rotación balística: se asignan ángulos aleatorios coherentes con el sentido de avance horizontal (giro horario si va hacia la derecha, antihorario si va hacia la izquierda) entre $180^\circ$ y $360^\circ$ en el ápice, y hasta $720^\circ$ en el impacto.
- **Keyframes CSS**:
  - `0%`: posición inicial (`--start-x`, `--start-y`), opacidad 0, `scale(0.4)`, rotación inicial.
  - `10%`: opacidad 1.
  - `50%`: ápice del tiro (`--mid-x`, `--mid-y`), `scale(1.35)`, rotación intermedia.
  - `85%`: llegada al objetivo (`--end-x`, `--end-y`), `scale(1.0)`, impacto directo.
  - `92%`: squash/bounce de impacto (`scale(1.2)`).
  - `100%`: desvanecimiento (`opacity: 0`).
- **Alternativas consideradas**:
  - *Física basada en Canvas o requestAnimationFrame*: Aumenta la complejidad del renderizado y el consumo de CPU con múltiples proyectiles simultáneos. Las transformaciones CSS con variables dinámicas se benefician de la aceleración por GPU y son extremadamente eficientes.
  - *Arco estático en CSS*: Imposible de sincronizar con puntos de origen perimetrales aleatorios y tarjetas ubicadas en distintas coordenadas de la pantalla.

## Risks / Trade-offs

- **[Recorte del arco en pantallas pequeñas o tarjetas altas]** → Si una tarjeta está cerca del borde superior, un arco pronunciado podría sacar el emoji fuera de la pantalla.
  *Mitigación*: Se aplica `Math.max(15, min(startY, endY) - arcHeight)` para que el vértice nunca sobrepase el límite superior visible.
- **[Ráfagas intensas de proyectiles]** → Decenas de proyectiles lanzados rápidamente podrían generar saturación visual o sobrecarga si los elementos no se limpian puntualmente.
  *Mitigación*: Cada proyectil tiene un temporizador exacto (`setTimeout`) tras la finalización de su animación (850ms) que lo remueve de la lista del estado.
- **[Disparos en tests E2E]** → Los tests existentes envían emojis antiguos (`🚀`, `🎯`, etc.).
  *Mitigación*: Se actualiza `server/test-e2e.js` con el nuevo set permitido para garantizar que todas las pruebas pasen al 100%.
