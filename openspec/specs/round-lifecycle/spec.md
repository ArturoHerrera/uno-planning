# Spec: Round Lifecycle

## Purpose

Controla el ciclo de vida de la ronda de votación, incluyendo el estado oculto, la revelación simultánea con animación flip 3D, el cálculo de métricas de consenso y el reinicio de la mesa.

## Requirements

### Requirement: Revelación de votos y animación 3D
El sistema SHALL permitir al anfitrión revelar los votos emitidos mediante un botón de estilo lúdico oficial de UNO (óvalo inclinado, rojo, tipografía amarilla con contorno y efecto 3D) situado en el centro de la mesa de paño, el cual SHALL estar habilitado únicamente cuando al menos un participante haya emitido su voto y permanecer deshabilitado con retroalimentación visual si no se han registrado votos, desplegando un modal de cierre de estimación para todos los participantes al activarse.

#### Scenario: Anfitrión presiona botón de revelar
- **WHEN** al menos un participante ha emitido su voto y el anfitrión activa la acción de revelar cartas
- **THEN** todas las cartas sobre la mesa ejecutan la animación de volteo (flip 3D), mostrando el anverso con su color y valor asignado y se despliega el modal de resultados para todos los participantes

#### Scenario: Botón de revelar deshabilitado cuando no hay votos
- **WHEN** ningún participante ha emitido voto en la ronda activa
- **THEN** el botón de revelar votos permanece en estado deshabilitado (con estilo atenuado, sin efecto hover ni respuesta a clics) mostrando una indicación de que se requiere al menos un voto para revelar

### Requirement: Cálculo de promedio y consenso
El sistema SHALL computar automáticamente la media aritmética, la moda y el grado de acuerdo una vez que las cartas han sido reveladas, o proveer un estado neutro y resiliente sin interrupciones cuando no se hayan emitido votos o solo existan votos cualitativos, permitiendo al anfitrión aceptar dicho consenso, seleccionar una puntuación manual acordada o reiniciar la ronda de la misma tarea.

#### Scenario: Consenso perfecto en la ronda
- **WHEN** todos los participantes votantes han elegido el mismo valor numérico y se revelan las cartas
- **THEN** el sistema resalta el consenso unánime y despliega una animación de celebración (confeti)

#### Scenario: Votos numéricos divergentes
- **WHEN** los participantes votan diferentes valores numéricos
- **THEN** el sistema calcula y muestra el promedio numérico exacto y resalta el valor más repetido (moda)

#### Scenario: Revelación sin votos o con votos cualitativos únicamente
- **WHEN** el anfitrión activa la acción de revelar cartas y ningún participante ha emitido voto numérico (o solo votaron cartas cualitativas como café o duda)
- **THEN** el sistema despliega el modal de resultados sin arrojar errores, mostrando un estado amigable indicando la ausencia de votos numéricos y permitiendo votar de nuevo o fijar una estimación manual

#### Scenario: Asignación de puntuación por el anfitrión
- **WHEN** el anfitrión selecciona una puntuación en el modal y hace clic en "Guardar y Continuar"
- **THEN** el sistema registra dicha puntuación en la tarea activa, cierra el modal para todos y avanza a la siguiente tarea

#### Scenario: Reinicio de ronda sin acuerdo
- **WHEN** el anfitrión elige "Votar de Nuevo" tras debatir la tarea
- **THEN** la mesa se restablece en blanco para la misma tarea permitiendo una nueva ronda de estimación

### Requirement: Reinicio de ronda
El sistema SHALL permitir limpiar los votos y volver al estado inicial de votación sin alterar la lista de participantes.

#### Scenario: Inicio de nueva estimación
- **WHEN** el anfitrión selecciona la acción de reiniciar ronda
- **THEN** todas las cartas de los participantes se restablecen a estado no votado y la mesa queda lista para una nueva ronda
