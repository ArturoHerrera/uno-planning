# Spec Delta: Reactions

## MODIFIED Requirements

### Requirement: Envío y despliegue de reacciones
El sistema SHALL permitir a cualquier participante pasar el cursor sobre la tarjeta de otro participante para desplegar un selector de emojis accesible, visible y sin solapamientos ni bloqueos por otros elementos de la mesa, ofreciendo el catálogo de emojis reordenado y actualizado (`🍅`, `🔥`, `🚀`, `🎯`, `🃏`, `👏`, `⏰`, `☕`) donde el reloj permite recordar amigablemente el tiempo y el café se posiciona al final para indicar pausas, permitiendo arrojar proyectiles de reacciones en tiempo real visibles para toda la sala de forma anónima, admitiendo ráfagas continuas de múltiples clics por segundo.

#### Scenario: Usuario despliega selector de reacciones
- **WHEN** un usuario posiciona el cursor (hover) sobre la tarjeta de otro participante en la mesa
- **THEN** el sistema despliega una barra emergente con la lista de emojis permitidos (`🍅`, `🔥`, `🚀`, `🎯`, `🃏`, `👏`, `⏰`, `☕`), situando el reloj en la penúltima posición y el café en la última, garantizando total clickabilidad

#### Scenario: Usuario arroja un emoji a un compañero
- **WHEN** el usuario hace clic sobre un emoji de la barra emergente (por ejemplo, el reloj `⏰`)
- **THEN** el sistema emite el evento de reacción a todos los miembros de la sala sin identificar al emisor y despliega un proyectil volador que viaja desde un borde perimetral aleatorio de la pantalla hasta la tarjeta del destinatario impactándola con animación y sacudida

#### Scenario: Ráfaga de clics sucesivos
- **WHEN** un participante pulsa un emoji repetidamente múltiples veces por segundo
- **THEN** el sistema genera y proyecta cada emoji de forma independiente en vuelo simultáneo creando una lluvia balística desde diversas direcciones sobre el objetivo
