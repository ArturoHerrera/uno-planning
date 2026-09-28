# Design

## Context

Véase `proposal.md` para el contexto y motivación del cambio.
En la implementación actual (`Room.jsx` y `FlipCard.jsx`), el tapete central (`poker-table-center-felt`) posee `z-20`, mientras que el contenedor de jugadores tiene `z-10`. Además, la barra de reacciones de `FlipCard.jsx` se posiciona de forma absoluta con `-top-12`. Al estar dentro de un contexto de apilamiento con `z-10`, cualquier solapamiento físico con el tapete central hace que el tapete capture los eventos de ratón (`pointer-events`), bloqueando el clic en los emojis y tapando parcialmente la barra.

## Goals / Non-Goals

**Goals:**
- Asegurar que la barra emergente de reacciones sobre cualquier tarjeta de participante sea 100% visible, accesible y cliqueable sin ser bloqueada por el tapete central ni por tarjetas adyacentes.
- Incrementar la separación espacial entre el tapete central y el contenedor de tarjetas para evitar colisiones visuales apretadas.
- Mantener la elevación z-index limpia y predecible en todo momento.

**Non-Goals:**
- Modificar la lógica de sockets o la animación balística de los proyectiles (que ya funciona correctamente cuando recibe el clic).
- Alterar la lista de emojis permitidos.

## Decisions

### Decisión 1: Jerarquía de contextos de apilamiento (`z-index`)
- **Elección**:
  - Tapete central de la mesa: capa base `relative z-10`.
  - Contenedor de jugadores: capa superior `relative z-20`.
  - Tarjeta individual (`FlipCard.jsx`): contenedor con elevación dinámica `relative ${isHovered ? 'z-50' : 'z-10'}`.
  - Barra emergente de reacciones: `z-50 pointer-events-auto`.
- **Razón**: Al elevar dinámicamente la tarjeta en hover a `z-50`, no solo sobrepasa el tapete central sino también cualquier tarjeta vecina en caso de layouts compactos o resoluciones estrechas.
- **Alternativas consideradas**:
  - Mover la barra de reacciones a un React Portal o al `body`: Innecesariamente complejo para una barra ligada directamente a la tarjeta del jugador que ya cuenta con posición relativa.

### Decisión 2: Separación vertical entre el centro de la mesa y las tarjetas
- **Elección**: Aumentar el margen vertical entre el tapete central y el contenedor de jugadores (`mt-6 sm:mt-8` o `space-y-6`), garantizando que la barra emergente `-top-12` disponga de espacio visual despejado.
- **Razón**: Evita que visualmente los emojis queden apretados o cortados por la base del tapete.

## Risks / Trade-offs

- **[Riesgo]** Pantallas de poca altura (viewports reducidos verticalmente) podrían causar scroll vertical si el margen es excesivo.
  - **Mitigación**: Usar espaciados responsivos (`mt-4 sm:mt-6` o `gap-6`) que respeten las proporciones de la mesa circular existente.
