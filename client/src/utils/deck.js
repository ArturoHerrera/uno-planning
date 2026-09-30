// Escala de Fibonacci para UNO-PLANNING (topado en 13) + comodines (9 cartas)
export const FIBONACCI_VALUES = [0, 1, 2, 3, 5, 8, 13, '?', '☕'];

// Patrón secuencial oficial de colores UNO: Azul -> Verde -> Amarillo -> Rojo
export const DECK_COLOR_CYCLE = ['blue', 'green', 'yellow', 'red'];

/**
 * Genera la baraja con el patrón secuencial cíclico de colores UNO
 * Los comodines tienen asignación 'wild'
 */
export function generateRandomDeck() {
  let colorIndex = 0;
  return FIBONACCI_VALUES.map(val => {
    let color = 'wild';
    if (val !== '?' && val !== '☕') {
      color = DECK_COLOR_CYCLE[colorIndex % DECK_COLOR_CYCLE.length];
      colorIndex++;
    }
    return {
      value: val,
      color
    };
  });
}

