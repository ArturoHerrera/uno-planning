# Spec Delta: Task Queue

## MODIFIED Requirements

### Requirement: Visualización y acceso directo
El sistema SHALL mostrar la tarea activa actual en el centro de la mesa de votación y la lista completa en un panel de columna lateral persistente, garantizando que el elemento correspondiente a la tarea activa permanezca enfocado y visible automáticamente en dicho panel sin requerir scroll manual por parte del usuario. Si la tarea activa es una URL (`http://` o `https://`), el sistema SHALL renderizarla como un enlace clickeable interactivo en el centro de la mesa para permitir su apertura directa en una nueva pestaña del navegador.

#### Scenario: Participante hace clic en el enlace de la tarea
- **WHEN** un participante presiona sobre el enlace de la tarea activa desplegada en el centro de la mesa o en la columna lateral
- **THEN** el sistema abre el enlace en una nueva pestaña del navegador de forma directa sin requerir abrir el panel lateral

#### Scenario: Visualización de cola en columna lateral
- **WHEN** un participante se encuentra en la sala de votación
- **THEN** la interfaz distribuye el espacio en dos columnas (área de mesa/votación y columna lateral de tareas), permitiendo consultar las tareas anteriores, activa y futuras con sus puntuaciones acordadas sin necesidad de abrir modales

#### Scenario: Enfoque y auto-scroll de tarea activa en lista larga
- **WHEN** cambia la tarea activa seleccionada y la cola de tareas excede la altura visible del panel lateral
- **THEN** la interfaz desplaza automáticamente la vista de la lista hacia la tarea activa, manteniéndola visible y destacada sin interacción manual de scroll
