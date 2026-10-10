# Spec Delta: Host Onboarding

## MODIFIED Requirements

### Requirement: Activación y persistencia del tutorial de anfitrión
El sistema SHALL permitir al usuario activar o desactivar la opción de tutorial de anfitrión desde el Lobby directamente asociado al bloque de creación de sala ("Crear Nueva Sala"), guardando la preferencia en `localStorage` de tal forma que una vez completado o desactivado, permanezca inactivo en futuras sesiones a menos que sea rehabilitado expresamente por el usuario.

#### Scenario: Anfitrión con tutorial activado ingresa a la sala
- **WHEN** un usuario ingresa a una sala como anfitrión con la opción de tutorial activada
- **THEN** la sala despliega el tutorial guiado spotlight oscureciendo el fondo y enfocando el primer paso

#### Scenario: Anfitrión con tutorial completado o desactivado
- **WHEN** un usuario ingresa como anfitrión habiendo completado previamente el tour o con la opción deshabilitada
- **THEN** el tutorial no se muestra automáticamente y la sala carga directamente en su estado operativo normal
