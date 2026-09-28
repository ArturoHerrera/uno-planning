# Spec Delta: Room Management

## MODIFIED Requirements

### Requirement: Creación y unión a salas
El sistema SHALL permitir a cualquier usuario crear una nueva sala con un código/identificador único o unirse a una sala existente mediante dicho código o enlace directo, reconociendo y extrayendo automáticamente el código de sala si el usuario pega una URL completa en el campo de código.

#### Scenario: Usuario crea una nueva sala
- **WHEN** un usuario ingresa su nombre y selecciona "Crear Sala"
- **THEN** el sistema genera una sala con identificador único en memoria, le asigna el rol de anfitrión (host) y le redirige a la vista de la sala

#### Scenario: Usuario se une a una sala existente mediante URL
- **WHEN** un participante navega a la URL de una sala existente e introduce su nombre
- **THEN** el sistema lo conecta a la sesión en tiempo real y notifica a todos los miembros de la sala su presencia

#### Scenario: Usuario pega URL completa en el campo de código
- **WHEN** un usuario pega un enlace con parámetro `?room=CODIGO` en el campo de código de sala
- **THEN** el sistema extrae automáticamente solo el código alfanumérico para facilitar la unión sin errores

### Requirement: Persistencia local de identidad
El sistema SHALL recordar el nombre del usuario localmente en el navegador para evitar reingresos manuales constantes, destacando al anfitrión con insignia visible de `👑 Host` en la mesa y barra superior.

#### Scenario: Recuperación de nombre almacenado
- **WHEN** el usuario ingresa a la aplicación habiendo usado previamente la herramienta en ese navegador
- **THEN** el sistema autocompleta el campo de nombre con el valor guardado en `localStorage`

#### Scenario: Visualización clara de roles
- **WHEN** los participantes ingresan a la sala
- **THEN** la interfaz identifica claramente al anfitrión con insignia de corona dorada y distingue a los votantes y espectadores
