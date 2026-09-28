# Spec Delta: Round Lifecycle

## MODIFIED Requirements

### Requirement: Cálculo de promedio y consenso
El sistema SHALL computar automáticamente la media aritmética, la moda y el grado de acuerdo una vez que las cartas han sido reveladas, validando estrictamente que los votos emitidos provengan de la baraja oficial de UNO Planning (`[0, 1, 2, 3, 5, 8, 13, 20, 40, 100, '?', '☕']`) y descartando valores inválidos o corruptos (`NaN`, `Infinity`, números negativos o cadenas arbitrarias) para evitar envenenamiento de métricas.

#### Scenario: Votación con valores numéricos válidos
- **WHEN** los participantes votan valores válidos de la baraja y se revelan las cartas
- **THEN** el sistema calcula el promedio numérico exacto redondeado a un decimal y determina la moda y el consenso

#### Scenario: Voto con valor no reconocido o malicioso
- **WHEN** un cliente envía un valor de voto que no pertenece a la baraja oficial permitida o envía `NaN`/`Infinity`
- **THEN** el servidor rechaza el voto y mantiene el estado previo del participante sin alterar el cálculo de métricas

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

## ADDED Requirements

### Requirement: Cuotas y validación de listas de tareas
El sistema SHALL aplicar cuotas de tamaño al importar o configurar tareas, limitando la lista a un máximo de 50 tareas y cada título o URL a un máximo de 300 caracteres para evitar saturación de memoria y ataques de carga excesiva (Task Bomb).

#### Scenario: Importación de tareas dentro de los límites
- **WHEN** el anfitrión suministra una lista de tareas de hasta 50 elementos con textos de hasta 300 caracteres
- **THEN** el sistema guarda y distribuye la lista normalmente a todos los clientes

#### Scenario: Intento de cargar lista excesiva
- **WHEN** el anfitrión intenta cargar una lista superior a 50 tareas o títulos que excedan 300 caracteres
- **THEN** el servidor trunca o recorta la lista y los textos al límite de seguridad permitido antes de almacenarlos
