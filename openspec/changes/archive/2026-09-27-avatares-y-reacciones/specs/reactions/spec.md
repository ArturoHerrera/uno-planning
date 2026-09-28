# Spec: Reactions

## Purpose

Permite a los participantes enviarse reacciones efímeras en tiempo real (emojis con animación de impacto) para aumentar la interactividad y diversión durante la sesión de votación.

## ADDED Requirements

### Requirement: Envío y despliegue de reacciones
El sistema SHALL permitir a cualquier participante pasar el cursor sobre la tarjeta o avatar de otro participante para desplegar un selector de emojis amigables y arrojarle una reacción en tiempo real visible para toda la sala.

#### Scenario: Usuario despliega selector de reacciones
- **WHEN** un usuario posiciona el cursor (hover) sobre la tarjeta de otro participante en la mesa
- **THEN** el sistema despliega una barra emergente con la lista de emojis permitidos (🍅, 🔥, 🚀, 🎯, ☕, 🃏, 👏, 😂)

#### Scenario: Usuario arroja un emoji a un compañero
- **WHEN** el usuario hace clic sobre un emoji de la barra emergente
- **THEN** el sistema emite el evento de reacción a todos los miembros de la sala y ejecuta una animación de impacto y sacudida sobre la tarjeta del destinatario

### Requirement: Desvanecimiento efímero de reacciones
El sistema SHALL desvanecer y remover automáticamente el efecto visual de la reacción en pantalla transcurridos entre 1.5 y 2 segundos sin persistencia en el servidor.

#### Scenario: Efecto de impacto se disuelve
- **WHEN** transcurren 2 segundos tras la llegada del impacto visual del emoji
- **THEN** la animación de la reacción desaparece gradualmente restableciendo la tarjeta a su estado normal
