# Spec Delta: round-lifecycle

## MODIFIED Requirements

### Requirement: Revelación de votos y animación 3D
El sistema SHALL permitir al anfitrión revelar los votos emitidos mediante un botón de estilo lúdico oficial de UNO (óvalo inclinado, rojo, tipografía amarilla con contorno y efecto 3D) con el texto "¡BAJAR CARTAS!", situado en el centro de la mesa de paño, el cual SHALL estar habilitado únicamente cuando al menos un participante haya emitido su voto y permanecer deshabilitado con retroalimentación visual si no se han registrado votos, desplegando un modal de cierre de estimación para todos los participantes al activarse.

#### Scenario: Anfitrión presiona botón de revelar
- **WHEN** al menos un participante ha emitido su voto y el anfitrión presiona "¡BAJAR CARTAS!"
- **THEN** todas las cartas sobre la mesa ejecutan la animación de volteo (flip 3D), mostrando el anverso con su color y valor asignado y se despliega el modal de resultados para todos los participantes

#### Scenario: Botón de revelar deshabilitado cuando no hay votos
- **WHEN** ningún participante ha emitido voto en la ronda activa
- **THEN** el botón de revelar votos permanece en estado deshabilitado (con estilo atenuado, sin efecto hover ni respuesta a clics) mostrando una indicación de que se requiere al menos un voto para revelar

### Requirement: Cálculo de promedio y consenso
El sistema SHALL computar automáticamente la media aritmética, la moda y el grado de acuerdo una vez que las cartas han sido reveladas, validando estrictamente que los votos emitidos provengan de la baraja oficial de UNO Planning (`[0, 1, 2, 3, 5, 8, 13, 20, 40, 100, '?', '☕']`), identificando visualmente los valores extremos (puntaje más alto vs puntaje más bajo) para orientar el debate ágil, y celebrando unánimemente cuando exista consenso total del 100% de los votantes.

#### Scenario: Consenso perfecto en la ronda (¡UNO! Consenso Total)
- **WHEN** todos los participantes votantes activos han elegido exactamente el mismo valor numérico y se revelan las cartas
- **THEN** el sistema muestra prominentemente el distintivo "¡UNO! Consenso Total", despliega animación festiva de confeti y emite un acorde armónico de éxito

#### Scenario: Votos numéricos divergentes con identificación de discrepancias
- **WHEN** los participantes votan diferentes valores numéricos en la ronda
- **THEN** el sistema resalta de manera visual y diferenciada el puntaje más alto y el puntaje más bajo con los nombres de sus respectivos votantes, facilitando la discusión del equipo Scrum antes del cierre definitivo

#### Scenario: Votación con valores numéricos válidos
- **WHEN** los participantes votan valores válidos de la baraja y se revelan las cartas
- **THEN** el sistema calcula el promedio numérico exacto redondeado a un decimal y determina la moda y el consenso

#### Scenario: Voto con valor no reconocido o malicioso
- **WHEN** un cliente envía un valor de voto que no pertenece a la baraja oficial permitida o envía `NaN`/`Infinity`
- **THEN** el servidor rechaza el voto y mantiene el estado previo del participante sin alterar el cálculo de métricas

#### Scenario: Revelación sin votos o con votos cualitativos únicamente
- **WHEN** el anfitrión activa la acción de revelar cartas y ningún participante ha emitido voto numérico (o solo votaron cartas cualitativas como café o duda)
- **THEN** el sistema despliega el modal de resultados sin arrojar errores, mostrando el mensaje "Mesa indecisa: Nadie arriesgó una carta" y permitiendo votar de nuevo o fijar una estimación manual

#### Scenario: Asignación de puntuación por el anfitrión
- **WHEN** el anfitrión selecciona una puntuación en el modal y hace clic en "Guardar y Continuar"
- **THEN** el sistema registra dicha puntuación en la tarea activa, cierra el modal para todos y avanza a la siguiente tarea

#### Scenario: Reinicio de ronda sin acuerdo
- **WHEN** el anfitrión elige "Siguiente Mano" o "Votar de Nuevo" tras debatir la tarea
- **THEN** la mesa se restablece en blanco para la misma tarea permitiendo una nueva ronda de estimación

## ADDED Requirements

### Requirement: Solicitud de aclaración mediante carta de duda (`?`)
El sistema SHALL pausar automáticamente el temporizador de la ronda activa y desplegar un modal prioritario no cancelable a todos los miembros de la sala cuando un participante emita un voto con la carta comodín `?`.

#### Scenario: Participante juega carta de duda
- **WHEN** un participante selecciona la carta `?` durante una ronda con temporizador o votación abierta
- **THEN** el servidor pausa inmediatamente el cronómetro y abre un modal en pantalla indicando que dicho participante tiene dudas sobre la historia

#### Scenario: Resolución de duda y continuación del tiempo
- **WHEN** el anfitrión o moderador presiona el botón "Duda resuelta (Continuar tiempo)" en el modal de preguntas
- **THEN** el modal se cierra para todos los participantes y el temporizador reanuda la cuenta regresiva desde los segundos restantes previos a la pausa

#### Scenario: Resolución de duda y reinicio del tiempo
- **WHEN** el anfitrión o moderador presiona el botón "Reiniciar tiempo" en el modal de preguntas
- **THEN** el modal se cierra para todos los participantes y el temporizador se restablece a su duración completa original para comenzar de nuevo la estimación
