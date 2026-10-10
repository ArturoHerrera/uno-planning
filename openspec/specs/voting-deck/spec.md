# Spec: Voting Deck

## Purpose

Define la baraja de estimación basada en la sucesión de Fibonacci con estética vectorial inspirada en el juego de cartas UNO, colores aleatorios, retroalimentación táctil y modos de participación.

## Requirements

### Requirement: Baraja de cartas Fibonacci estilo UNO
El sistema SHALL presentar una baraja de estimación compuesta por los valores `0, 1, 2, 3, 5, 8, 13`, junto con las cartas comodín `?` (duda) y `☕` (pausa).

#### Scenario: Visualización de cartas estilo UNO
- **WHEN** un participante visualiza su mano de cartas disponible
- **THEN** cada carta renderiza la geometría visual de UNO (borde exterior redondeado, óvalo central inclinado, números en esquina y centro), con un tamaño adaptado para que las 9 cartas sean completamente visibles en pantalla sin corte

#### Scenario: Asignación aleatoria de colores
- **WHEN** se presenta la baraja de cartas a un participante
- **THEN** las cartas numéricas reciben cíclicamente los colores base de UNO siguiendo la secuencia fija: azul (`#0054A6`), verde (`#54B948`), amarillo (`#FFDE00`) y rojo (`#ED1C24`), repitiendo dicho orden para los números subsecuentes en lugar de asignarse aleatoriamente, mientras que las cartas comodín (`?` y `☕`) conservan su presentación especial/wild

### Requirement: Emisión y cambio de voto
El sistema SHALL permitir al participante seleccionar una carta para emitir su voto o cambiar su selección antes de que la ronda sea revelada, emitiendo retroalimentación sonora sutil de colocación de carta (*card snap*) y distinguiendo visualmente en la mesa entre participantes que están listos y aquellos que aún están pensando.

#### Scenario: Selección de carta y retroalimentación táctil/sonora
- **WHEN** un participante hace clic en una carta de su mano
- **THEN** la carta queda marcada como seleccionada en su interfaz, se reproduce un sonido sutil de carta colocada sobre la mesa, y el resto de los participantes observan en la mesa la carta boca abajo con un distintivo prominente de "Listo"

#### Scenario: Participante en espera de emitir su voto
- **WHEN** un participante activo aún no ha seleccionado carta durante una ronda abierta
- **THEN** su lugar en la mesa exhibe una ranura vacía con la indicación animada "Pensando...", permitiendo al resto del equipo identificarlo y reaccionar con emojis

### Requirement: Modo Espectador (No votar)
El sistema SHALL permitir a cualquier participante declararse como espectador en cualquier momento de la sesión.

#### Scenario: Activación de modo espectador
- **WHEN** un participante activa la opción de no participar en la votación
- **THEN** su carta en la mesa se muestra identificada como espectador y no es requerida para el cálculo de promedio ni consenso
