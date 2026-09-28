# Proposal: Mejoras de UX (Favicon, Logo Home, Gestión de Usuario y Timer Zen)

## Why

Para llevar a UNO-PLANNING a un nivel superior de pulido y usabilidad en sesiones reales de estimación, los usuarios necesitan una navegación intuitiva, conveniencia al registrar su nombre y una herramienta de gestión del tiempo que marque el ritmo de la sesión sin generar estrés innecesario. Asimismo, el favicon por defecto de Vite desentona con la identidad visual del juego UNO.

## What Changes

1. **Favicon Temático UNO**: Sustitución del favicon por defecto de Vite por un SVG estilizado inspirado en las cartas de UNO con sus cuatro colores icónicos.
2. **Navegación al Home en Logo Header**: Al hacer clic en el logo "UNO-PLANNING" desde dentro de una sala activa, el usuario regresa al Lobby principal (permitiendo crear otra sala o registrarse de nuevo).
3. **Persistencia y Limpieza de Nombre de Usuario**: Guardado automático del nombre en memoria local (`localStorage`), prellenado en el formulario del Lobby y agregado de un botón de limpieza rápida (`X` o botón de borrado) para facilitar el cambio de identidad.
4. **Timer Sincronizado Minimalista (Estilo UNO)**:
   - Controlado exclusivamente por el anfitrión (Host).
   - Opciones predeterminadas de duración: 20s, 40s, 60s y 80s, con inicio, pausa y reinicio.
   - Sincronización en tiempo real para todos los participantes mediante WebSockets.
   - Al expirar el tiempo, la ronda no se fuerza; el anfitrión mantiene la potestad de revelar o reiniciar.
   - Sonido zen y relajante (estilo tic-tac de madera tenue y chime tranquilo al finalizar), con opción de silenciar para cada participante.

## Capabilities

### New Capabilities
- `round-timer`: Temporizador sincronizado para rondas de estimación controlado por el anfitrión con audio ambiental tranquilo y feedback visual estilo UNO.

### Modified Capabilities
- `room-management`: Navegación al home desde el logo del header y controles de limpieza de nombre persistido en el lobby.

## Impact

- **Frontend**: Componentes `Room.jsx`, `Lobby.jsx`, nuevo componente `RoundTimer.jsx`, `favicon.svg` y Web Audio API sintetizada (sin dependencias pesadas de audio).
- **Backend**: Gestión del estado del temporizador en `server/index.js` (`timer:start`, `timer:pause`, `timer:reset`) y difusión en `room:updated` o evento específico.
