# Design: Rediseño de Mesa Redonda y Mejoras de UX

## Context

Véase `proposal.md` para la motivación. La interfaz actual presenta una fila plana de cartas sobre un contenedor rectangular, la tarea está alejada en un banner superior y el botón de revelar votos puede activarse con 0 votos. Además, los avatares se generan con `fun-emoji` (monocromáticos e indistinguibles) y el vocabulario técnico está acoplado a Jira.

## Goals / Non-Goals

**Goals:**
- Crear una mesa de juego con presencia física visible (forma redonda/ovalada, textura de paño de casino y borde acolchado 3D).
- Colocar la tarea activa en el centro neurálgico de la mesa, haciéndola directamente clickeable e interactiva si es una URL.
- Deshabilitar el botón "¡REVELAR VOTOS!" cuando no exista al menos un voto registrado.
- Proporcionar alta diversidad visual en los avatares integrando colecciones ricas de Dicebear (`adventurer`, `bottts`, `avataaars`, `lorelei`) con botón de dados estilizado.
- Neutralizar el lenguaje técnico de la interfaz para soportar cualquier gestor de tareas o enlaces.

**Non-Goals:**
- Alterar la lógica del servidor de estimación ni el almacenamiento en memoria ($0.00).
- Cambiar la baraja de votación Fibonacci existente.

## Decisions

### 1. Estructura de Mesa Redonda / Ovalada con Paño de Casino
- **Decisión:** Reemplazar el contenedor plano por una mesa con paño de póker de contornos suaves (`rounded-[48px] sm:rounded-[60px]`), borde de cuero/madera oscura con bisel 3D e iluminación radial interior (`bg-radial from-emerald-950/20 via-slate-900/60 to-slate-950/80` en modo oscuro / verde esmeralda paño clásico con relieve).
- Los participantes se distribuyen fluidamente en torno al paño, orientados hacia el centro de la mesa.
- *Alternativas consideradas*: Mesa puramente circular fija con coordenadas trigonométricas absolutas. Se descartó en favor de un diseño elíptico responsivo con flexbox/grid adaptable para soportar pantallas móviles y escritorios sin desbordamientos.

### 2. Tarea Clickeable y Acción Principal en el Centro del Paño
- **Decisión:** Ubicar en el centro del paño:
  1. La **Tarea activa**: con badge de progreso (`1 de N`), puntuación acordada si ya fue estimada, y si es URL (`http://` o `https://`), un enlace interactivo con icono de apertura externa (`ExternalLink`).
  2. Los controles de navegación del anfitrión (`< Anterior` / `Siguiente >`) integrados en el bloque central.
  3. El contador de participación en tiempo real (`X de Y votos emitidos`).
  4. El botón oficial de UNO **"¡REVELAR VOTOS!"** o el resumen de resultados si la ronda ya fue revelada.
- *Beneficio*: Todo el foco visual del equipo converge en el mismo punto donde se debate y se revela la ronda.

### 3. Habilitación Condicional del Botón de Revelación
- **Decisión:** Evaluar `hasVotes = participants.some(p => !p.isSpectator && p.hasVoted)`.
- El botón de revelación aplica `disabled={!hasVotes}`.
- En CSS, `.btn-uno-reveal:disabled` tendrá opacidad reducida (`opacity-40`), filtro en escala de grises, cursor `not-allowed`, y anulación de efectos de elevación o hover.

### 4. Colecciones de Avatares Ricas y Diversas
- **Decisión:** Almacenar el avatar en formato `estilo:seed` o seleccionar aleatoriamente entre colecciones vibrantes de Dicebear (`adventurer`, `avataaars`, `bottts`, `lorelei`).
- Al presionar el botón de dados, se sortea tanto un nuevo seed como una nueva colección/variación, garantizando que cada avatar tenga peinado, piel, accesorios y estilo completamente diferenciados.
- El botón de dados se rediseña con tamaño ergonómico (32px), borde brillante neón, micro-animación de giro 360° al hacer clic y hover tooltip.

### 5. Universalización de Tareas y Enlaces
- **Decisión:** Renombrar funciones y textos:
  - `isJiraLink` $\rightarrow$ `isUrl`
  - "Pegar URLs de Jira" $\rightarrow$ "Pegar lista de tareas o enlaces"
  - Modal: "Gestionar Tareas y Enlaces" con ejemplos de Linear, GitHub, Jira y Notion.

## Risks / Trade-offs

- **[Riesgo] Responsividad en pantallas móviles con muchos participantes**: En móviles, una mesa ovalada muy ancha podría apretar las cartas.
  - *Mitigación*: En pantallas pequeñas (`< 640px`), la mesa adapta su ratio y permite scroll suave o disposición en anillo vertical sin deformar las cartas.
