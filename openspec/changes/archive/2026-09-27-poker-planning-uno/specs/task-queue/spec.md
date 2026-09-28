# Spec Delta: Task Queue

## Purpose

Permite al anfitrión cargar, ordenar y navegar por una lista de tareas/enlaces externos (Jira) visibles y accesibles para todos los participantes de la sala.

## ADDED Requirements

### Requirement: Carga de lista de tareas
El sistema SHALL permitir al anfitrión ingresar una o varias URLs de tareas (por ejemplo de Jira) para definir el backlog a estimar en la sesión.

#### Scenario: Anfitrión ingresa lista de enlaces
- **WHEN** el anfitrión pega enlaces de tareas en el panel de tareas
- **THEN** el sistema registra la cola de tareas y fija la primera como la tarea activa de la sesión

### Requirement: Visualización y acceso directo
El sistema SHALL mostrar la tarea activa actual en un lugar destacado con enlace clickable para todos los participantes de la sala.

#### Scenario: Participante hace clic en el enlace de la tarea
- **WHEN** un participante presiona sobre la URL o identificador de la tarea activa
- **THEN** el sistema abre el enlace en una nueva pestaña del navegador para consultar sus detalles

### Requirement: Navegación de tareas
El sistema SHALL permitir al anfitrión avanzar a la siguiente tarea o volver a una anterior, sincronizando automáticamente a toda la sala.

#### Scenario: Avance de tarea por el anfitrión
- **WHEN** el anfitrión hace clic en "Siguiente Tarea"
- **THEN** la nueva tarea se convierte en la activa para todos los participantes y se reinician los votos para la nueva estimación
