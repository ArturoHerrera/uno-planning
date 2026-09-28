import { COLOR_KEYS } from '../components/UnoCard';

// Escala de Fibonacci para UNO-PLANNING (topado en 34) + comodines
export const FIBONACCI_VALUES = [0, 1, 2, 3, 5, 8, 13, 21, 34, '?', '☕'];

/**
 * Genera una baraja con colores aleatorios entre los 4 colores de UNO
 * Los comodines tienen asignaciones especiales
 */
export function generateRandomDeck() {
  return FIBONACCI_VALUES.map(val => {
    let color = 'wild';
    if (val !== '?' && val !== '☕') {
      const randomIndex = Math.floor(Math.random() * COLOR_KEYS.length);
      color = COLOR_KEYS[randomIndex];
    }
    return {
      value: val,
      color
    };
  });
}
