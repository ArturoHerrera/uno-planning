# Spec Delta: Task Queue

## MODIFIED Requirements

### Requirement: Carga de lista de tareas
El sistema SHALL permitir al anfitrión ingresar una o varias URLs de tareas (por ejemplo de Jira) para definir el backlog a estimar en la sesión, registrando su título/enlace y su puntuación asignada.

#### Scenario: Anfitrión ingresa lista de enlaces
- **WHEN** el anfitrión pega enlaces de tareas en el panel de tareas
- **THEN** el sistema registra la cola de tareas con puntuación pendiente y fija la primera como la tarea activa de la sesión

### Requirement: Visualización y acceso directo
El sistema SHALL mostrar la tarea activa actual y la lista de tareas en un panel de columna lateral persistente con enlaces clickables, identificador y la puntuación de puntos otorgada a cada tarea estimada.

#### Scenario: Participante hace clic en el enlace de la tarea
- **WHEN** un participante presiona sobre la URL o identificador de una tarea en la columna lateral o en el panel de tarea activa
- **THEN** el sistema abre el enlace en una nueva pestaña del navegador para consultar sus detalles

#### Scenario: Visualización de cola en columna lateral
- **WHEN** un participante se encuentra en la sala de votación
- **THEN** la interfaz distribuye el espacio en dos columnas (área de mesa/votación y columna lateral de tareas), permitiendo consultar las tareas anteriores, activa y futuras con sus puntuaciones acordadas sin necesidad de abrir modales

### Requirement: Navegación de tareas
El sistema SHALL permitir al anfitrión avanzar a la siguiente tarea o volver a una anterior, sincronizando automáticamente a toda la sala, proveyendo controles de navegación visibles y prominentes ("Anterior" y "Siguiente") con indicador de progreso numérico.

#### Scenario: Avance de tarea por el anfitrión
- **WHEN** el anfitrión hace clic en "Siguiente Tarea"
- **THEN** la nueva tarea se convierte en la activa para todos los participantes y se reinician los votos para la nueva estimación
