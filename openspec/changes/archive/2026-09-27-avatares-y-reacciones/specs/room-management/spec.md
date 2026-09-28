# Spec Delta: Room Management

## MODIFIED Requirements

### Requirement: Persistencia local de identidad
El sistema SHALL recordar el nombre y avatar asignado al usuario localmente en el navegador para evitar reingresos manuales constantes, permitiendo al usuario regenerar su avatar aleatorio en el lobby antes de unirse, y mostrando dicho avatar e insignia visible de `👑 Host` en la mesa y barra superior.

#### Scenario: Recuperación de nombre almacenado
- **WHEN** el usuario ingresa a la aplicación habiendo usado previamente la herramienta en ese navegador
- **THEN** el sistema autocompleta el campo de nombre con el valor guardado en `localStorage`

#### Scenario: Visualización clara de roles
- **WHEN** los participantes ingresan a la sala
- **THEN** la interfaz identifica claramente al anfitrión con insignia de corona dorada y distingue a los votantes y espectadores

#### Scenario: Generación y persistencia de avatar aleatorio
- **WHEN** un usuario interactúa en la pantalla de bienvenida o ingresa su nombre
- **THEN** el sistema asigna un avatar gráfico aleatorio (con botón para alternar caras) y lo preserva en el almacenamiento local para asociarlo a su identidad en la sala
