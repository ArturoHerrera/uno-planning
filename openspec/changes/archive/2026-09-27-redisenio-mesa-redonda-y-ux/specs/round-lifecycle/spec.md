# Spec Delta: Round Lifecycle

## MODIFIED Requirements

### Requirement: Revelación de votos y animación 3D
El sistema SHALL permitir al anfitrión revelar los votos emitidos mediante un botón de estilo lúdico oficial de UNO (óvalo inclinado, rojo, tipografía amarilla con contorno y efecto 3D) situado en el centro de la mesa de paño, el cual SHALL estar habilitado únicamente cuando al menos un participante haya emitido su voto y permanecer deshabilitado con retroalimentación visual si no se han registrado votos, desplegando un modal de cierre de estimación para todos los participantes al activarse.

#### Scenario: Anfitrión presiona botón de revelar
- **WHEN** al menos un participante ha emitido su voto y el anfitrión activa la acción de revelar cartas
- **THEN** todas las cartas sobre la mesa ejecutan la animación de volteo (flip 3D), mostrando el anverso con su color y valor asignado y se despliega el modal de resultados para todos los participantes

#### Scenario: Botón de revelar deshabilitado cuando no hay votos
- **WHEN** ningún participante ha emitido voto en la ronda activa
- **THEN** el botón de revelar votos permanece en estado deshabilitado (con estilo atenuado, sin efecto hover ni respuesta a clics) mostrando una indicación de que se requiere al menos un voto para revelar
