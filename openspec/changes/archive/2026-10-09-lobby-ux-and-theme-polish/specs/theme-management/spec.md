# Spec Delta: Theme Management

## MODIFIED Requirements

### Requirement: Alternancia de tema claro y oscuro
El sistema SHALL permitir al usuario alternar entre tema oscuro y tema claro en cualquier momento de la sesión, tanto desde la pantalla inicial del Lobby como dentro de una sala activa.

#### Scenario: Cambio de tema visual
- **WHEN** el usuario hace clic en el interruptor de tema (icono Sol/Luna)
- **THEN** la interfaz actualiza inmediatamente la paleta de colores, contrastes de texto y gradientes de fondo

#### Scenario: Cambio de tema visual desde el Lobby
- **WHEN** el usuario hace clic en el interruptor de tema (icono Sol/Luna) ubicado en la esquina superior derecha del Lobby
- **THEN** la interfaz del Lobby actualiza inmediatamente su fondo, contenedor de login, textos y contraste visual acorde al tema seleccionado

#### Scenario: Cambio de tema visual dentro de la sala
- **WHEN** el usuario hace clic en el interruptor de tema (icono Sol/Luna) en la cabecera de la sala
- **THEN** la interfaz de la sala actualiza inmediatamente la mesa, cartas, paneles y contrastes de texto
