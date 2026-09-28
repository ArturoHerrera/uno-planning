# Spec Delta: Round Lifecycle

## Purpose

Controla el ciclo de vida de la ronda de votación, incluyendo el estado oculto, la revelación simultánea con animación flip 3D, el cálculo de métricas de consenso y el reinicio de la mesa.

## ADDED Requirements

### Requirement: Revelación de votos y animación 3D
El sistema SHALL permitir al anfitrión revelar los votos emitidos por los participantes mediante una animación de volteo simultánea.

#### Scenario: Anfitrión presiona botón de revelar
- **WHEN** el anfitrión activa la acción de revelar cartas
- **THEN** todas las cartas sobre la mesa ejecutan la animación de volteo (flip 3D), mostrando el anverso con su color y valor asignado

### Requirement: Cálculo de promedio y consenso
El sistema SHALL computar automáticamente la media aritmética, la moda y el grado de acuerdo una vez que las cartas han sido reveladas.

#### Scenario: Consenso perfecto en la ronda
- **WHEN** todos los participantes votantes han elegido el mismo valor numérico y se revelan las cartas
- **THEN** el sistema resalta el consenso unánime y despliega una animación de celebración (confeti)

#### Scenario: Votos numéricos divergentes
- **WHEN** los participantes votan diferentes valores numéricos
- **THEN** el sistema calcula y muestra el promedio numérico exacto y resalta el valor más repetido (moda)

### Requirement: Reinicio de ronda
El sistema SHALL permitir limpiar los votos y volver al estado inicial de votación sin alterar la lista de participantes.

#### Scenario: Inicio de nueva estimación
- **WHEN** el anfitrión selecciona la acción de reiniciar ronda
- **THEN** todas las cartas de los participantes se restablecen a estado no votado y la mesa queda lista para una nueva ronda
