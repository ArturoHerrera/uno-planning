# Spec: Voting Deck

## Purpose

Define la baraja de estimación basada en la sucesión de Fibonacci con estética vectorial inspirada en el juego de cartas UNO, colores aleatorios y modos de participación.

## Requirements

### Requirement: Baraja de cartas Fibonacci estilo UNO
El sistema SHALL presentar una baraja de estimación compuesta por los valores `0, 1, 2, 3, 5, 8, 13, 21, 34`, junto con las cartas comodín `?` (duda) y `☕` (pausa).

#### Scenario: Visualización de cartas estilo UNO
- **WHEN** un participante visualiza su mano de cartas disponible
- **THEN** cada carta renderiza la geometría visual de UNO (borde exterior redondeado, óvalo central inclinado, números en esquina y centro), con un tamaño adaptado para que las 11 cartas sean completamente visibles en pantalla sin corte

#### Scenario: Asignación aleatoria de colores
- **WHEN** se presenta la baraja de cartas a un participante
- **THEN** cada carta numérica recibe aleatoriamente uno de los cuatro colores base de UNO (rojo `#ED1C24`, azul `#0054A6`, verde `#54B948` o amarillo `#FFDE00`)

### Requirement: Emisión y cambio de voto
El sistema SHALL permitir al participante seleccionar una carta para emitir su voto o cambiar su selección antes de que la ronda sea revelada.

#### Scenario: Selección de carta
- **WHEN** un participante hace clic en una carta de su mano
- **THEN** la carta queda marcada como seleccionada en su interfaz y el resto de los participantes observan en la mesa que el usuario ya votó, sin mostrar el valor

### Requirement: Modo Espectador (No votar)
El sistema SHALL permitir a cualquier participante declararse como espectador en cualquier momento de la sesión.

#### Scenario: Activación de modo espectador
- **WHEN** un participante activa la opción de no participar en la votación
- **THEN** su carta en la mesa se muestra identificada como espectador y no es requerida para el cálculo de promedio ni consenso
