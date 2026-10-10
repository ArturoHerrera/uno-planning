# Proposal: Game Design, UX & Wording Revamp

## Why

UNO-Planning utiliza la estética del juego de cartas UNO como metáfora visual para el Poker Planning ágil. Sin embargo, el flujo de trabajo actual carece de momentos clave de interacción ágil y refinamiento UX:
- La carta `?` no ofrece una mecánica real de detención o solicitud de aclaración ante dudas.
- La revelación de votos no destaca los valores extremos (más alto vs más bajo) para dinamizar el debate del equipo Scrum, ni celebra adecuadamente el consenso unánime.
- Falta un tutorial introductorio enfocado y conciso para nuevos Scrum Masters / Anfitriones que utilicen la plataforma.
- La confirmación de votos y el wording pueden optimizarse para transmitir una experiencia más lúdica y clara sin perder la eficiencia productiva de la ceremonia.

## What Changes

- **Mecánica de Carta de Pregunta (`?` / Pausa para dudas)**: Al seleccionar la carta `?`, se pausa el temporizador de la sala y se muestra un modal prioritario no cancelable con el nombre de quien tiene dudas, ofreciendo acciones exclusivas para "Duda resuelta (Continuar tiempo)" o "Reiniciar tiempo".
- **Consenso Total ¡UNO!**: Celebración visual destacada (banner, confeti y sonido armónico de éxito) cuando el 100% de los votantes coinciden en la misma puntuación.
- **Showdown y Debate de Discrepancias (Outliers)**: El modal de resultados se abre para todos los participantes e identifica de forma clara el puntaje más alto y el más bajo con sus respectivos votantes, facilitando el debate Scrum antes de asentar el puntaje.
- **Tutorial Spotlight para Anfitriones**: Incorporación de un tour con enfoque visual de contrastes/sombras (spotlight) activable desde el Lobby para hosts primerizos, explicando en micro-pasos concisos el temporizador, el mazo de historias y el botón de revelar votos.
- **Micro-interacciones y Feedback de Estado "Listo"**: Sonido sutil y micro-animación de colocación de carta (*card-snap*), con distinción visual nítida entre quien está "Listo" y quien sigue "Pensando...".
- **Wording Ágil-Lúdico**: Adopción de terminología temática refinada ("¡BAJAR CARTAS!", "Siguiente Mano", "Tu Mano", "Mazo de Historias", "¡UNO! Consenso Total", "Mesa indecisa").

## Capabilities

### New Capabilities
- `host-onboarding`: Tutorial guiado spotlight con fondos oscurecidos y pasos concisos para anfitriones de sala.

### Modified Capabilities
- `round-lifecycle`: Incorporación de pausa por carta `?`, detección de consenso ¡UNO! y resumen con contraste de outliers (más alto vs más bajo).
- `round-timer`: Capacidad de pausar y reiniciar temporizador en respuesta a preguntas sobre historias.
- `voting-deck`: Feedback háptico/sonoro de carta sobre mesa y estados "Listo" vs "Pensando".

## Impact

- **Frontend**: Componentes `Room.jsx`, `ResultsModal.jsx`, `RoundTimer.jsx`, `Lobby.jsx`, `FlipCard.jsx`, `UnoCard.jsx` y nuevos utilitarios/modales (`QuestionModal.jsx`, `HostTutorial.jsx`).
- **Backend / WebSockets**: Sincronización de eventos de pausa por duda (`question-raised`, `question-resolved`) en `server/index.js`.
- **Persistencia Local**: Preferencia de tutorial de host guardada en `localStorage`.
