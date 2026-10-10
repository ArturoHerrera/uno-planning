# Spec: Theme Management

## Purpose

Permite a los usuarios alternar entre un tema visual oscuro con gradientes profundos y un tema claro luminoso con persistencia en el almacenamiento local.

## Requirements

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

### Requirement: Persistencia local de preferencia de tema
El sistema SHALL recordar la elección de tema en `localStorage` del navegador.

#### Scenario: Recuperación de preferencia de tema
- **WHEN** un usuario ingresa a la aplicación habiendo seleccionado previamente un tema
- **THEN** el sistema carga y aplica automáticamente dicho tema sin parpadeos bruscos
