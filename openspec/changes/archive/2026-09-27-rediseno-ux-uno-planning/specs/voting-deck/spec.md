# Spec Delta: Voting Deck

## MODIFIED Requirements

### Requirement: Baraja de cartas Fibonacci estilo UNO
El sistema SHALL presentar una baraja de estimación compuesta por los valores `0, 1, 2, 3, 5, 8, 13, 21, 34`, junto con las cartas comodín `?` (duda) y `☕` (pausa).

#### Scenario: Visualización de cartas estilo UNO
- **WHEN** un participante visualiza su mano de cartas disponible
- **THEN** cada carta renderiza la geometría visual de UNO (borde exterior redondeado, óvalo central inclinado, números en esquina y centro), con un tamaño adaptado para que las 11 cartas sean completamente visibles en pantalla sin corte

#### Scenario: Asignación aleatoria de colores
- **WHEN** se presenta la baraja de cartas a un participante
- **THEN** cada carta numérica recibe aleatoriamente uno de los cuatro colores base de UNO (rojo `#ED1C24`, azul `#0054A6`, verde `#54B948` o amarillo `#FFDE00`)
