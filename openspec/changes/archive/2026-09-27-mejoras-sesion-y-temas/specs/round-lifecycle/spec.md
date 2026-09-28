# Spec Delta: Round Lifecycle

## MODIFIED Requirements

### Requirement: Revelación de votos y animación 3D
El sistema SHALL permitir al anfitrión revelar los votos emitidos mediante un botón de estilo lúdico oficial de UNO (óvalo inclinado, rojo, tipografía amarilla con contorno y efecto 3D) y desplegar un modal de cierre de estimación para todos los participantes.

#### Scenario: Anfitrión presiona botón de revelar
- **WHEN** el anfitrión activa la acción de revelar cartas
- **THEN** todas las cartas sobre la mesa ejecutan la animación de volteo (flip 3D), mostrando el anverso con su color y valor asignado y se despliega el modal de resultados para todos los participantes

### Requirement: Cálculo de promedio y consenso
El sistema SHALL computar automáticamente la media aritmética, la moda y el grado de acuerdo una vez que las cartas han sido reveladas, permitiendo al anfitrión aceptar dicho consenso, seleccionar una puntuación manual acordada o reiniciar la ronda de la misma tarea.

#### Scenario: Consenso perfecto en la ronda
- **WHEN** todos los participantes votantes han elegido el mismo valor numérico y se revelan las cartas
- **THEN** el sistema resalta el consenso unánime y despliega una animación de celebración (confeti)

#### Scenario: Votos numéricos divergentes
- **WHEN** los participantes votan diferentes valores numéricos
- **THEN** el sistema calcula y muestra el promedio numérico exacto y resalta el valor más repetido (moda)

#### Scenario: Asignación de puntuación por el anfitrión
- **WHEN** el anfitrión selecciona una puntuación en el modal y hace clic en "Guardar y Continuar"
- **THEN** el sistema registra dicha puntuación en la tarea activa, cierra el modal para todos y avanza a la siguiente tarea

#### Scenario: Reinicio de ronda sin acuerdo
- **WHEN** el anfitrión elige "Votar de Nuevo" tras debatir la tarea
- **THEN** la mesa se restablece en blanco para la misma tarea permitiendo una nueva ronda de estimación
