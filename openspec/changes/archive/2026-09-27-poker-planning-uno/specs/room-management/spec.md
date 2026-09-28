# Spec Delta: Room Management

## Purpose

Proporciona la gestión del ciclo de vida de salas efímeras de votación en memoria, asignación de roles y sincronización de presencia en tiempo real sin almacenamiento persistente.

## ADDED Requirements

### Requirement: Creación y unión a salas
El sistema SHALL permitir a cualquier usuario crear una nueva sala con un código/identificador único o unirse a una sala existente mediante dicho código o enlace directo.

#### Scenario: Usuario crea una nueva sala
- **WHEN** un usuario ingresa su nombre y selecciona "Crear Sala"
- **THEN** el sistema genera una sala con identificador único en memoria, le asigna el rol de anfitrión (host) y le redirige a la vista de la sala

#### Scenario: Usuario se une a una sala existente mediante URL
- **WHEN** un participante navega a la URL de una sala existente e introduce su nombre
- **THEN** el sistema lo conecta a la sesión en tiempo real y notifica a todos los miembros de la sala su presencia

### Requirement: Persistencia local de identidad
El sistema SHALL recordar el nombre del usuario localmente en el navegador para evitar reingresos manuales constantes.

#### Scenario: Recuperación de nombre almacenado
- **WHEN** el usuario ingresa a la aplicación habiendo usado previamente la herramienta en ese navegador
- **THEN** el sistema autocompleta el campo de nombre con el valor guardado en `localStorage`

### Requirement: Destrucción efímera de salas
El sistema SHALL mantener el estado de las salas exclusivamente en memoria volátil del servidor y destruirlas cuando queden desiertas.

#### Scenario: Desconexión del último participante
- **WHEN** el último participante abandona o cierra la sesión de una sala
- **THEN** el servidor libera de la memoria el estado completo de dicha sala
