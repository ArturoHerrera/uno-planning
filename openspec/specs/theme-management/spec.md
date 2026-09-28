# Spec: Theme Management

## Purpose

Permite a los usuarios alternar entre un tema visual oscuro con gradientes profundos y un tema claro luminoso con persistencia en el almacenamiento local.

## Requirements

### Requirement: Alternancia de tema claro y oscuro
El sistema SHALL permitir al usuario alternar entre tema oscuro y tema claro en cualquier momento de la sesión.

#### Scenario: Cambio de tema visual
- **WHEN** el usuario hace clic en el interruptor de tema (icono Sol/Luna)
- **THEN** la interfaz actualiza inmediatamente la paleta de colores, contrastes de texto y gradientes de fondo

### Requirement: Persistencia local de preferencia de tema
El sistema SHALL recordar la elección de tema en `localStorage` del navegador.

#### Scenario: Recuperación de preferencia de tema
- **WHEN** un usuario ingresa a la aplicación habiendo seleccionado previamente un tema
- **THEN** el sistema carga y aplica automáticamente dicho tema sin parpadeos bruscos
