# Proposal

## Why

Al rediseñar la mesa de póker e incorporar el tapete central con la tarea activa, el selector emergente de reacciones emoji (`FlipCard.jsx`) quedó solapado y bloqueado por el contenedor central (`Room.jsx`), debido a un conflicto de apilamiento (`z-index` y `stacking context`) y espacio vertical. Esto impide que los usuarios puedan hacer clic en los emojis para lanzarlos a sus compañeros.

## What Changes

- Modificación del contexto de apilamiento (`z-index`) en la mesa redonda: el tapete central pasa a una capa base controlada (`z-10`) y el área de tarjetas de jugadores a una capa superior (`z-20`).
- Elevación dinámica (`z-50`) de la tarjeta que esté en hover para que su barra emergente de emojis se sitúe siempre por encima de cualquier otro elemento de la mesa sin interferencias.
- Ajuste de espaciado y separación vertical entre el tapete central y las tarjetas de los jugadores para otorgar suficiente margen visual y de interacción a la barra de reacciones (`-top-12`).

## Capabilities

### Modified Capabilities
- `reactions`: Garantizar que la barra emergente de reacciones no quede bloqueada, solapada o interceptada por el tapete central de la mesa, permitiendo clics e interacción continua sin restricciones.

## Impact

- `client/src/components/Room.jsx`: Ajuste de clases de apilamiento `z-index` y márgenes verticales de la mesa.
- `client/src/components/FlipCard.jsx`: Elevación contextual de la tarjeta en hover y puntero garantizado en la barra emergente de reacciones.
