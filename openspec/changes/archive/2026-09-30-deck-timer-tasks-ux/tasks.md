# Tasks: Deck, Timer Sounds & Task Focus UX

## 1. Baraja de cartas y secuencia de colores

- [x] 1.1 Actualizar `client/src/utils/deck.js` eliminando 21 y 34 de `FIBONACCI_VALUES` dejando la escala en `[0, 1, 2, 3, 5, 8, 13, '?', '☕']`, verificando que la longitud sea de 9 elementos.
- [x] 1.2 Implementar en `client/src/utils/deck.js` la asignación cíclica de colores base de UNO (azul, verde, amarillo, rojo) para las cartas numéricas manteniendo comodines en `'wild'`, verificando que la baraja se genere con la secuencia determinista esperada.
- [x] 1.3 Verificar que `client/src/components/ResultsModal.jsx` y la mano del jugador en `client/src/components/Room.jsx` / `UnoCard.jsx` visualicen la baraja ajustada de 9 cartas sin desbordes.


## 2. Paisaje sonoro del temporizador por hitos

- [x] 2.1 Implementar en `client/src/utils/sound.js` las funciones de audio sintetizado con Web Audio API `playTimerStart()` (tono ascendente de inicio) y `playTimerMidpoint()` (campanita sutil al 50%), verificando que respeten `isSoundMuted()`.
- [x] 2.2 Refactorizar `client/src/components/RoundTimer.jsx` eliminando el tic-tac continuo por segundo y programando el disparo de audio en los hitos clave: inicio (`playTimerStart`), mitad de tiempo (`playTimerMidpoint`), cuenta regresiva en los últimos 5 segundos (5, 4, 3, 2, 1 con `playSoftTick`) y chime final en 00:00 (`playZenChime`).
- [x] 2.3 Probar el temporizador con duraciones cortas (20s) y normales (60s) comprobando que solo se emita sonido en los hitos estipulados y que el botón de silencio deshabilite todo audio.


## 3. Auto-scroll y enfoque de tarea activa

- [x] 3.1 Incorporar en `client/src/components/Room.jsx` una referencia React (`activeTaskRef`) al elemento correspondiente al índice actual (`index === roomState.currentTaskIndex`) y un efecto que ejecute `scrollIntoView({ behavior: 'smooth', block: 'nearest' })` ante cambios en `currentTaskIndex`.
- [x] 3.2 Validar con una lista larga de tareas (ej. 10 tareas) que al avanzar con "Siguiente Tarea" o cambiar de tarea como anfitrión, el contenedor con scroll desplace automáticamente la tarea activa hacia el campo visual sin requerir desplazamiento manual.


## 4. Validación general y compilación

- [x] 4.1 Ejecutar `npm run build` en el cliente y correr `node server/test-e2e.js` verificando que la compilación y pruebas pasen limpiamente sin errores.
- [x] 4.2 Validar la integridad del cambio en OpenSpec ejecutando `npx openspec validate deck-timer-tasks-ux --strict`.

