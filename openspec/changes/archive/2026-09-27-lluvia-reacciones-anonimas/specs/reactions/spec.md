# Spec Delta: Reactions

## MODIFIED Requirements

### Requirement: Envío y despliegue de reacciones
El sistema SHALL permitir a cualquier participante pasar el cursor sobre la tarjeta de otro participante para desplegar un selector de emojis y arrojarle proyectiles de reacciones en tiempo real visibles para toda la sala, los cuales emergen desde bordes perimetrales aleatorios de la pantalla hacia la tarjeta objetivo de forma anónima, admitiendo ráfagas continuas de múltiples clics por segundo.

#### Scenario: Usuario despliega selector de reacciones
- **WHEN** un usuario posiciona el cursor (hover) sobre la tarjeta de otro participante en la mesa
- **THEN** el sistema despliega una barra emergente con la lista de emojis permitidos (🍅, 🔥, 🚀, 🎯, ☕, 🃏, 👏, 😂)

#### Scenario: Usuario arroja un emoji a un compañero
- **WHEN** el usuario hace clic sobre un emoji de la barra emergente
- **THEN** el sistema emite el evento de reacción a todos los miembros de la sala sin identificar al emisor y despliega un proyectil volador que viaja desde un borde perimetral aleatorio de la pantalla hasta la tarjeta del destinatario impactándola con animación y sacudida

#### Scenario: Ráfaga de clics sucesivos
- **WHEN** un participante pulsa un emoji repetidamente múltiples veces por segundo
- **THEN** el sistema genera y proyecta cada emoji de forma independiente en vuelo simultáneo creando una lluvia balística desde diversas direcciones sobre el objetivo

### Requirement: Desvanecimiento efímero de reacciones
El sistema SHALL desvanecer y remover cada proyectil inmediatamente tras completar su trayectoria e impacto sobre la tarjeta objetivo, limpiando los elementos visuales de la pantalla sin persistencia en el servidor.

#### Scenario: Efecto de impacto se disuelve
- **WHEN** un proyectil en vuelo alcanza las coordenadas de la tarjeta objetivo
- **THEN** el emoji ejecuta una animación de impacto instantáneo (splat) y se remueve de la memoria de la pantalla restableciendo la tarjeta tras su sacudida
