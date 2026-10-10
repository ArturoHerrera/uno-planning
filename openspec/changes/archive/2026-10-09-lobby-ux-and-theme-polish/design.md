# Design: Lobby UX & Theme Polish

## Context

El componente `Lobby` actualmente opera con estilos oscuros fijos (`bg-slate-950`, `bg-slate-900`), mientras que la gestión de tema (`theme`, `onToggleTheme`) reside en `App.jsx` y solo se suministraba al componente `Room`. Además, la tarjeta de acceso presentaba dos llamadas redundantes a `handleRandomizeAvatar` y un toggle de tutorial de Scrum Master posicionado en un nivel general antes del botón de creación de sala.

## Goals / Non-Goals

**Goals:**
- Extender el interruptor de tema (`theme` / `onToggleTheme`) al `Lobby` ubicándolo en la esquina superior derecha (`top-4 right-4`).
- Brindar soporte estético bitemático (claro y oscuro) a todos los elementos del Lobby: fondo general, tarjeta central, inputs, textos y bordes.
- Unificar la interacción de aleatorización de avatar a un único botón de dados `🎲` integrado en el avatar con micro-animación de rotación activa.
- Reubicar el toggle de "Tutorial de Anfitrión" inmediatamente debajo del botón "Crear Nueva Sala" (Opción A explorada).
- Preservar la experiencia visual interactiva existente en el Hero (cartas con hover).

**Non-Goals:**
- Agregar enlaces o botones externos (sin enlaces a GitHub ni redes).
- Cambiar la lógica de comunicación con el backend / socket.io.
- Modificar la estructura de rutas o navegación.

## Decisions

### 1. Control de tema en el nivel superior de Lobby
- **Decisión**: Añadir un botón flotante con posicionamiento absoluto (`absolute top-4 right-4 z-20`) con iconos `Sun` y `Moon` de `lucide-react`.
- **Alternativas consideradas**:
  - *Colocarlo dentro de la tarjeta de login*: Descartado porque satura la tarjeta y el tema es una preferencia global de la aplicación.
  - *Mantenerlo solo dentro de Room*: Descartado por mala UX para usuarios con preferencia por modo claro.

### 2. Estilos adaptativos en Lobby
- **Decisión**: Usar clases condicionales dependientes de `isDark` (`theme === 'dark'`) para:
  - Fondo de pantalla: `bg-slate-950` en oscuro vs `bg-slate-100` / `bg-slate-50` con luces suaves en claro.
  - Tarjeta de acceso: `bg-slate-900/90 border-slate-800` en oscuro vs `bg-white/95 border-slate-200 shadow-xl` en claro.
  - Textos e inputs: contraste óptimo (`text-slate-800` y `bg-slate-50/80` en modo claro).

### 3. Reducción a un único control de aleatorización de avatar
- **Decisión**: Remover la píldora `[🎲 Cambiar estilo]` sobre el input de nombre. El avatar mantiene su botón `🎲` en la esquina inferior derecha con `transform active:rotate-[360deg] duration-300 hover:scale-110`.
- **Alternativas consideradas**:
  - *Hacer todo el avatar clickeable*: Es viable, pero mantener el botón de dados explícito en la esquina es más intuitivo para usuarios nuevos sin necesidad de adivinar si la imagen es clickeable.

### 4. Reubicación del tutorial debajo de "Crear Nueva Sala"
- **Decisión**: Mover el bloque del toggle a un contenedor secundario directamente debajo del botón "Crear Nueva Sala", con estilos más sutiles y tamaño compacto para no competir con el botón principal ni distraer a quienes solo vienen a ingresar código.

## Risks / Trade-offs

- **[Contraste en modo claro]** → Mitigación: Utilizar tonos `slate-800` y `slate-600` para títulos y subtítulos del Hero y la tarjeta, manteniendo los colores vivos de las cartas UNO (rojo, azul, verde, amarillo).
