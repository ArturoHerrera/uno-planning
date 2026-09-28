import React from 'react';

// Colores oficiales UNO
export const UNO_COLORS = {
  red: '#ED1C24',
  blue: '#0054A6',
  green: '#54B948',
  yellow: '#FFDE00',
  wild: '#18181b'
};

export const COLOR_KEYS = ['red', 'blue', 'green', 'yellow'];

/**
 * Componente SVG que emula la geometría exacta de las cartas de UNO
 * @param {string|number} value - Valor de la carta (0, 1, 2, ..., '?', '☕')
 * @param {string} color - 'red' | 'blue' | 'green' | 'yellow' | 'wild'
 * @param {boolean} isSelected - Si está seleccionada por el usuario
 * @param {boolean} isBack - Si se muestra el dorso "POKER"
 * @param {function} onClick - Handler de click
 * @param {string} className - Clases CSS adicionales
 */
export const UnoCard = ({
  value,
  color = 'red',
  isSelected = false,
  isBack = false,
  onClick,
  className = '',
  size = 'md' // 'sm', 'md', 'lg'
}) => {
  const cardColor = UNO_COLORS[color] || UNO_COLORS.red;
  const isWild = value === '?' || value === '☕' || color === 'wild';

  // Dimensiones escalables optimizadas para que quepan las 11 cartas en la mano
  const scale = size === 'sm' ? 0.7 : size === 'lg' ? 1.2 : size === 'hand' ? 0.72 : 0.85;
  const width = 120 * scale;
  const height = 180 * scale;

  if (isBack) {
    return (
      <div
        onClick={onClick}
        className={`relative inline-block select-none cursor-pointer transition-transform duration-200 ${className}`}
        style={{ width, height }}
      >
        <svg
          viewBox="0 0 120 180"
          width={width}
          height={height}
          className="drop-shadow-lg rounded-2xl overflow-hidden"
        >
          {/* Fondo exterior negro con borde blanco */}
          <rect
            x="3"
            y="3"
            width="114"
            height="174"
            rx="14"
            ry="14"
            fill="#111827"
            stroke="#ffffff"
            strokeWidth="5"
          />

          {/* Elipse roja inclinada central */}
          <g transform="translate(60, 90)">
            <ellipse
              cx="0"
              cy="0"
              rx="46"
              ry="26"
              fill="#ED1C24"
              stroke="#ffffff"
              strokeWidth="3.5"
              transform="rotate(-28)"
            />
            {/* Texto UNO en tipografía llamativa */}
            <text
              x="0"
              y="6"
              fill="#FFDE00"
              stroke="#000000"
              strokeWidth="1.5"
              paintOrder="stroke fill"
              fontSize="22"
              fontWeight="900"
              fontFamily="Impact, Arial Black, sans-serif"
              fontStyle="italic"
              textAnchor="middle"
              transform="rotate(-28)"
            >
              UNO
            </text>
          </g>

          {/* Pequeños círculos de detalle en esquinas */}
          <circle cx="15" cy="15" r="3" fill="#ffffff" opacity="0.4" />
          <circle cx="105" cy="165" r="3" fill="#ffffff" opacity="0.4" />
        </svg>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`relative inline-block select-none transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:-translate-y-3 hover:scale-105' : ''
      } ${isSelected ? '-translate-y-5 scale-105 ring-4 ring-amber-400 rounded-2xl shadow-2xl' : 'drop-shadow-md'} ${className}`}
      style={{ width, height }}
    >
      <svg
        viewBox="0 0 120 180"
        width={width}
        height={height}
        className="rounded-2xl overflow-hidden"
      >
        <defs>
          {/* Patrón de 4 cuadrantes para comodín '?' */}
          <clipPath id="oval-clip">
            <ellipse cx="60" cy="90" rx="46" ry="26" transform="rotate(-30 60 90)" />
          </clipPath>
        </defs>

        {/* Fondo exterior de color con borde blanco característico */}
        <rect
          x="3"
          y="3"
          width="114"
          height="174"
          rx="14"
          ry="14"
          fill={isWild ? '#18181b' : cardColor}
          stroke="#ffffff"
          strokeWidth="5"
        />

        {/* Elipse central */}
        {value === '?' ? (
          // Comodín multicolor tipo Wild
          <g>
            <g clipPath="url(#oval-clip)">
              <rect x="0" y="0" width="60" height="90" fill="#ED1C24" />
              <rect x="60" y="0" width="60" height="90" fill="#0054A6" />
              <rect x="0" y="90" width="60" height="90" fill="#FFDE00" />
              <rect x="60" y="90" width="60" height="90" fill="#54B948" />
            </g>
            <ellipse
              cx="60"
              cy="90"
              rx="46"
              ry="26"
              fill="none"
              stroke="#ffffff"
              strokeWidth="4"
              transform="rotate(-30 60 90)"
            />
          </g>
        ) : (
          // Elipse blanca inclinada clásica de UNO
          <ellipse
            cx="60"
            cy="90"
            rx="46"
            ry="26"
            fill="#ffffff"
            stroke={cardColor}
            strokeWidth="2"
            transform="rotate(-30 60 90)"
          />
        )}

        {/* Número / Símbolo Central Grande */}
        <text
          x="60"
          y={value === '☕' ? '98' : '102'}
          fill={value === '?' ? '#ffffff' : cardColor}
          stroke={value === '?' ? '#000000' : 'none'}
          strokeWidth={value === '?' ? '1.5' : '0'}
          fontSize={String(value).length > 2 ? '30' : '38'}
          fontWeight="900"
          fontFamily="Impact, Arial Black, sans-serif"
          fontStyle="italic"
          textAnchor="middle"
          transform="rotate(-5 60 90)"
          style={{ filter: 'drop-shadow(2px 2px 0px rgba(0,0,0,0.25))' }}
        >
          {value}
        </text>

        {/* Número en esquina superior izquierda */}
        <text
          x="12"
          y="26"
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="1.2"
          paintOrder="stroke fill"
          fontSize={String(value).length > 2 ? '14' : '18'}
          fontWeight="900"
          fontFamily="Impact, Arial Black, sans-serif"
          fontStyle="italic"
        >
          {value}
        </text>

        {/* Número en esquina inferior derecha (rotado 180°) */}
        <g transform="rotate(180 108 154)">
          <text
            x="108"
            y="154"
            fill="#ffffff"
            stroke="#000000"
            strokeWidth="1.2"
            paintOrder="stroke fill"
            fontSize={String(value).length > 2 ? '14' : '18'}
            fontWeight="900"
            fontFamily="Impact, Arial Black, sans-serif"
            fontStyle="italic"
          >
            {value}
          </text>
        </g>
      </svg>
    </div>
  );
};
