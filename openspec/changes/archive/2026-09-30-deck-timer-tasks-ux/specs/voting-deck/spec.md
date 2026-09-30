# Spec Delta: Voting Deck

## MODIFIED Requirements

### Requirement: Baraja de cartas Fibonacci estilo UNO
El sistema SHALL presentar una baraja de estimación compuesta por los valores `0, 1, 2, 3, 5, 8, 13`, junto con las cartas comodín `?` (duda) y `☕` (pausa).

#### Scenario: Visualización de cartas estilo UNO
- **WHEN** un participante visualiza su mano de cartas disponible
- **THEN** cada carta renderiza la geometría visual de UNO (borde exterior redondeado, óvalo central inclinado, números en esquina y centro), con un tamaño adaptado para que las 9 cartas sean completamente visibles en pantalla sin corte

#### Scenario: Asignación aleatoria de colores
- **WHEN** se presenta la baraja de cartas a un participante
- **THEN** las cartas numéricas reciben cíclicamente los colores base de UNO siguiendo la secuencia fija: azul (`#0054A6`), verde (`#54B948`), amarillo (`#FFDE00`) y rojo (`#ED1C24`), repitiendo dicho orden para los números subsecuentes en lugar de asignarse aleatoriamente, mientras que las cartas comodín (`?` y `☕`) conservan su presentación especial/wild
