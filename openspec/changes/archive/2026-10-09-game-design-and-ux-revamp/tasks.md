# Tasks

## 1. Backend: Sincronización de Preguntas (`?`) y Cálculo de Outliers

- [x] 1.1 Extender `server/index.js` para soportar evento de duda `?` en votos, pausando el temporizador y emitiendo `activeQuestion` en el estado de la sala. Verificar con test unitario/e2e que el temporizador se detiene.
- [x] 1.2 Agregar manejador en `server/index.js` para resolver preguntas (`resolve-question`) reanudando o reiniciando el cronómetro. Verificar con test e2e.
- [x] 1.3 Incorporar en el cálculo de métricas de `server/index.js` la detección de outliers (`minScore` y `maxScore` con votantes) y bandera de consenso total. Verificar que `minScore` y `maxScore` se calculan correctamente.

## 2. Frontend: Audio y Micro-interacciones

- [x] 2.1 Agregar en `client/src/utils/sound.js` los sintetizadores Web Audio API `playCardSnap()` y `playUnoSuccessFanfare()`. Verificar ejecutando en navegador que los audios no arrojan errores.
- [x] 2.2 Actualizar `FlipCard.jsx` y `UnoCard.jsx` para reproducir sonido `card-snap` al seleccionar carta y mostrar el estado "Listo" con badge claro y pulso sutil en lugar de un icono estático, manteniendo el estado "Pensando...".

## 3. Frontend: Modal de Pregunta y Wording en Mesa

- [x] 3.1 Crear `QuestionModal.jsx` para mostrar alerta no cancelable cuando un participante juega la carta `?`, con botones "Duda resuelta (Continuar tiempo)" y "Reiniciar tiempo".
- [x] 3.2 Actualizar `Room.jsx` con el nuevo vocabulario temático ("¡BAJAR CARTAS!", "Siguiente Mano", "Tu Mano", "Mazo de Historias") e integrar `QuestionModal`.

## 4. Frontend: Resultados con Outliers y Celebración ¡UNO!

- [x] 4.1 Actualizar `ResultsModal.jsx` para destacar visualmente las discrepancias (Puntaje más bajo vs más alto con nombres de participantes) cuando no haya consenso.
- [x] 4.2 Agregar en `ResultsModal.jsx` y `Room.jsx` la celebración visual y sonora de "¡UNO! Consenso Total" con fanfarria y confeti cuando el 100% de los votos coincidan, actualizando el mensaje de mesa vacía a "Mesa indecisa: Nadie arriesgó una carta".

## 5. Frontend: Onboarding Spotlight para el Host

- [x] 5.1 Agregar en `Lobby.jsx` el switch/toggle para activar o desactivar el tutorial de anfitrión, con persistencia en `localStorage`.
- [x] 5.2 Crear componente `HostTutorial.jsx` con overlay de contraste/spotlight que guíe en 3 pasos concisos (Temporizador, Mazo de Historias y ¡Bajar Cartas!), marcando finalización en `localStorage`. Integrarlo en `Room.jsx`.

## 6. Verificación y Pruebas

- [x] 6.1 Ejecutar suites de pruebas automatizadas existentes (`npm run test:security` y `npm run test:e2e`), actualizándolas si es necesario para cubrir el flujo de preguntas y métricas.
- [x] 6.2 Validar el flujo interactivo en el navegador asegurando que no existan errores de consola o regresiones visuales.
