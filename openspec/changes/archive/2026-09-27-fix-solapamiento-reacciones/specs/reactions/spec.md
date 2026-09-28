# Spec Delta: Reactions

## MODIFIED Requirements

### Requirement: Envío y despliegue de reacciones
El sistema SHALL permitir a cualquier participante pasar el cursor sobre la tarjeta de otro participante para desplegar un selector de emojis accesible, visible y sin solapamientos ni bloqueos por otros elementos de la mesa (como el tapete central o tarjetas vecinas), permitiendo arrojar proyectiles de reacciones en tiempo real visibles para toda la sala, los cuales emergen desde bordes perimetrales aleatorios de la pantalla hacia la tarjeta objetivo de forma anónima, admitiendo ráfagas continuas de múltiples clics por segundo.

#### Scenario: Usuario despliega selector de reacciones
- **WHEN** un usuario posiciona el cursor (hover) sobre la tarjeta de otro participante en la mesa
- **THEN** el sistema despliega una barra emergente con la lista de emojis permitidos (🍅, 🔥, 🚀, 🎯, ☕, 🃏, 👏, 😂) situada en una capa superior a todos los elementos del tapete central y de la mesa, garantizando la total clickabilidad de cada emoji

#### Scenario: Usuario arroja un emoji a un compañero
- **WHEN** el usuario hace clic sobre un emoji de la barra emergente
- **THEN** el sistema emite el evento de reacción a todos los miembros de la sala sin identificar al emisor y despliega un proyectil volador que viaja desde un borde perimetral aleatorio de la pantalla hasta la tarjeta del destinatario impactándola con animación y sacudida

#### Scenario: Ráfaga de clics sucesivos
- **WHEN** un participante pulsa un emoji repetidamente múltiples veces por segundo
- **THEN** el sistema genera y proyecta cada emoji de forma independiente en vuelo simultáneo creando una lluvia balística desde diversas direcciones sobre el objetivo
