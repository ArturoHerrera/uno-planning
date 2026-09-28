# Spec: Task Queue

## Purpose

Permite al anfitrión cargar, ordenar y navegar por una lista de tareas/enlaces externos (Jira) visibles y accesibles para todos los participantes de la sala.

## Requirements

### Requirement: Carga de lista de tareas
El sistema SHALL permitir al anfitrión ingresar una o varias URLs de tareas (compatibles con Jira, Linear, GitHub, Notion, Trello u otras plataformas) o títulos descriptivos para definir el backlog a estimar en la sesión, registrando su título o enlace y su puntuación asignada.

#### Scenario: Anfitrión ingresa lista de enlaces
- **WHEN** el anfitrión pega enlaces o títulos de tareas en el panel de tareas
- **THEN** el sistema registra la cola de tareas con puntuación pendiente y fija la primera como la tarea activa de la sesión

### Requirement: Visualización y acceso directo
El sistema SHALL mostrar la tarea activa actual en el centro de la mesa de votación y la lista completa en un panel de columna lateral persistente. Si la tarea activa es una URL (`http://` o `https://`), el sistema SHALL renderizarla como un enlace clickeable interactivo en el centro de la mesa para permitir su apertura directa en una nueva pestaña del navegador.

#### Scenario: Participante hace clic en el enlace de la tarea
- **WHEN** un participante presiona sobre el enlace de la tarea activa desplegada en el centro de la mesa o en la columna lateral
- **THEN** el sistema abre el enlace en una nueva pestaña del navegador de forma directa sin requerir abrir el panel lateral

#### Scenario: Visualización de cola en columna lateral
- **WHEN** un participante se encuentra en la sala de votación
- **THEN** la interfaz distribuye el espacio en dos columnas (área de mesa/votación y columna lateral de tareas), permitiendo consultar las tareas anteriores, activa y futuras con sus puntuaciones acordadas sin necesidad de abrir modales

### Requirement: Navegación de tareas
El sistema SHALL permitir al anfitrión avanzar a la siguiente tarea o volver a una anterior, sincronizando automáticamente a toda la sala, proveyendo controles de navegación visibles y prominentes ("Anterior" y "Siguiente") con indicador de progreso numérico.

#### Scenario: Avance de tarea por el anfitrión
- **WHEN** el anfitrión hace clic en "Siguiente Tarea"
- **THEN** la nueva tarea se convierte en la activa para todos los participantes y se reinician los votos para la nueva estimación
