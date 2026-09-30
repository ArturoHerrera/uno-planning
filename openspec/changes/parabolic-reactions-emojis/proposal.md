# Proposal

## Why

El sistema de reacciones efímeras actual presenta los proyectiles en una trayectoria recta y plana desde los bordes de la pantalla hacia la tarjeta objetivo, lo que carece de la sensación física de un objeto arrojado al aire. Además, el catálogo de emojis actual (`🍅`, `🔥`, `🚀`, `🎯`, `🃏`, `👏`, `⏰`, `☕`) puede hacerse mucho más divertido y temático para sesiones de poker planning de equipos de desarrollo si se incorporan elementos cómicos y de drama lúdico (cuchillo, ladrillo, popó, calavera, bug/alien), manteniendo los favoritos del equipo y situando el café al inicio de la barra.

## What Changes

- **Catálogo de Emojis Renovado**:
  - Se reorganiza y expande el catálogo a 9 emojis cómicos y temáticos de desarrollo: `☕`, `🍅`, `🔥`, `🔪`, `🧱`, `💩`, `💀`, `👾`, `⏰`.
  - El café (`☕`) se posiciona como primera opción al inicio de la barra emergente.
  - Se sustituyen `🚀`, `🎯`, `🃏` y `👏` por `🔪` (cuchillo), `🧱` (ladrillo), `💩` (popó), `💀` (calavera) y `👾` (bug/alien space invaders).
- **Física Balística de Lanzamiento**:
  - Los proyectiles se lanzan desde bordes periféricos con un arco parabólico dinámico que calcula un punto medio elevado (`midX`, `midY`) en función de la distancia y una altura de arco balístico.
  - Se añade variación de escala 3D durante el vuelo: escala `0.5` al despegar, elevación y aumento a `1.4` en el ápice (50% del recorrido), y descenso acelerado hacia `1.0` en el impacto.
  - Se añade rotación angular progresiva durante el vuelo para dotar de giro a cuchillos, ladrillos y proyectiles.
- **Validación y Pruebas**:
  - Se sincroniza la lista de emojis permitidos en el backend (`server/index.js`) y en las pruebas de integración multi-cliente (`server/test-e2e.js`).

## Capabilities

### New Capabilities
<!-- Ninguna nueva capacidad; se refina reactions -->

### Modified Capabilities
- `reactions`: Modifica el catálogo de emojis disponibles (posicionando `☕` al inicio e introduciendo `🔪`, `🧱`, `💩`, `💀`, `👾`) y redefine la trayectoria de vuelo de proyectiles lineales a tiro parabólico con arco balístico.

## Impact

- **Código afectado**:
  - `client/src/components/FlipCard.jsx`: arreglo `allowedEmojis` en la barra emergente de reacciones.
  - `client/src/components/ProjectilesOverlay.jsx`: cálculo balístico de `midX`, `midY`, variables CSS y duración.
  - `client/src/index.css`: keyframes de animación `@keyframes projectileFlight` con coordenadas intermedias y escala parabólica.
  - `server/index.js`: validación de lista de emojis en el evento `reaction:throw`.
  - `server/test-e2e.js`: actualización de la prueba de ráfaga de reacciones con los nuevos emojis.
