# Proposal: Rediseño de Mesa Redonda y Mejoras de UX

## Why

La experiencia de usuario actual presenta cuatro limitaciones clave que afectan la inmersión y usabilidad durante las sesiones de Poker Planning:
1. **Falta de presencia física de mesa**: La sala muestra un área rectangular genérica donde las cartas flotan en una fila plana horizontal sin sensación de mesa de juego compartida.
2. **Foco disperso**: La tarea activa se sitúa en un contenedor superior separado de la mesa, obligando a los participantes a desviar la atención fuera del área de votación.
3. **Acción prematura de revelación**: El botón "¡REVELAR VOTOS!" puede presionarse aun cuando nadie ha votado, generando confusión innecesaria.
4. **Variedad limitada de avatares y acoplamiento de marca**: La colección actual (`fun-emoji`) produce rostros casi idénticos con cambios imperceptibles, y los textos de la interfaz asumen exclusivamente URLs de Jira, limitando la adopción en equipos que usan Linear, GitHub, Notion u otras herramientas.

## What Changes

- **Mesa Redonda / Ovalada con Paño de Juego**: Transformar la sección de participantes en una mesa física con paño de póker/casino (borde acolchado con relieve 3D y textura de paño central) con los participantes sentados de forma natural alrededor de la misma.
- **Centro de Mesa Enfocado con Tarea Clickeable**: Colocar la tarea activa en el centro del paño de la mesa. Si el texto de la tarea es un enlace (`http://` o `https://`), se renderiza como enlace clickeable y destacado para que cualquier participante pueda abrirlo directamente en una nueva pestaña.
- **Botón de Revelar Votos Condicional**: Habilitar el botón "¡REVELAR VOTOS!" únicamente cuando al menos 1 participante activo haya emitido su voto (`disabled` con estilo atenuado y tooltip explicativo si no hay votos).
- **Avatares Expresivos y Diversos**: Reemplazar la colección monótona de avatares por colecciones ricas y coloridas de Dicebear (`adventurer`, `bottts`, `avataaars`, `lorelei`), con botón de dados rediseñado para que cada tirada ofrezca personajes con peinados, accesorios, expresiones y colores claramente diferenciados.
- **Wording Neutro para Tareas y Enlaces**: Generalizar los textos y placeholders ("Pegar lista de tareas o enlaces", "Gestionar Tareas y Enlaces", etc.) retirando menciones exclusivas a Jira.

## Capabilities

### Modified Capabilities
- `round-lifecycle`: Actualizar el requerimiento del botón de revelación para exigir al menos un voto emitido para habilitarse, e incorporar la disposición de la mesa redonda con foco central.
- `task-queue`: Generalizar el soporte de tareas a cualquier URL o título, y requerir que la tarea activa se despliegue de forma clickeable e interactiva en el centro de la mesa redonda.
- `room-management`: Enriquecer el requerimiento de avatares para garantizar una alta diversidad visual entre tiradas aleatorias.

## Impact

- **Frontend**:
  - `client/src/components/Room.jsx`: Reestructuración del área central en mesa redonda/ovalada con la tarea y botón al centro; habilitación condicional de "¡REVELAR VOTOS!".
  - `client/src/components/Lobby.jsx`: Actualización de la generación de avatares con colecciones diversas y estilización del botón de dados.
  - `client/src/components/TaskModal.jsx`: Ajuste de textos, títulos y placeholders neutros.
  - `client/src/index.css`: Estilos visuales de mesa de paño, borde de casino y estado deshabilitado del botón de revelación.
- **Backend / APIs**: Sin cambios en el protocolo Socket.io ni en la persistencia en RAM (100% retrocompatible).
