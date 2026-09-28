# Spec Delta: Task Queue

## MODIFIED Requirements

### Requirement: Visualización y acceso directo
El sistema SHALL mostrar la tarea activa actual y la lista de tareas en un panel de columna lateral persistente con enlaces clickables para todos los participantes de la sala.

#### Scenario: Participante hace clic en el enlace de la tarea
- **WHEN** un participante presiona sobre la URL o identificador de una tarea en la columna lateral o en el panel de tarea activa
- **THEN** el sistema abre el enlace en una nueva pestaña del navegador para consultar sus detalles

#### Scenario: Visualización de cola en columna lateral
- **WHEN** un participante se encuentra en la sala de votación
- **THEN** la interfaz distribuye el espacio en dos columnas (área de mesa/votación y columna lateral de tareas), permitiendo consultar las tareas anteriores, activa y futuras sin necesidad de abrir modales
