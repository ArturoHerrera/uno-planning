# Spec: Room Management

## Purpose

Proporciona la gestión del ciclo de vida de salas efímeras de votación en memoria, asignación de roles y sincronización de presencia en tiempo real sin almacenamiento persistente.

## Requirements

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
El sistema SHALL recordar el nombre y avatar asignado al usuario localmente en el navegador para evitar reingresos manuales constantes, permitiendo al usuario regenerar su avatar aleatorio en el lobby mediante un botón de dados estilizado que alterna entre colecciones y estilos diversos (como aventureros, robots y personajes ilustrados) para asegurar variedad visual, mostrando dicho avatar e insignia visible de `👑 Host` en la mesa y barra superior.

#### Scenario: Recuperación de nombre almacenado
- **WHEN** el usuario ingresa a la aplicación habiendo usado previamente la herramienta en ese navegador
- **THEN** el sistema autocompleta el campo de nombre con el valor guardado en `localStorage`

#### Scenario: Visualización clara de roles
- **WHEN** los participantes ingresan a la sala
- **THEN** la interfaz identifica claramente al anfitrión con insignia de corona dorada y distingue a los votantes y espectadores

#### Scenario: Generación y persistencia de avatar aleatorio
- **WHEN** un usuario hace clic en el botón de dados para cambiar de avatar o ingresa su nombre por primera vez
- **THEN** el sistema genera un avatar aleatorio con marcada diversidad en peinados, colores y colecciones visuales (`adventurer`, `bottts`, `avataaars`, etc.), actualizando el almacenamiento local y la vista previa del lobby

### Requirement: Destrucción efímera de salas
El sistema SHALL mantener el estado de las salas exclusivamente en memoria volátil del servidor y destruirlas cuando queden desiertas.

#### Scenario: Desconexión del último participante
- **WHEN** el último participante abandona o cierra la sesión de una sala
- **THEN** el servidor libera de la memoria el estado completo de dicha sala
