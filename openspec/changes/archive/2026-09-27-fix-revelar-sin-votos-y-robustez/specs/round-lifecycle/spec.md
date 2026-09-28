# Spec Delta: Round Lifecycle

## MODIFIED Requirements

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
