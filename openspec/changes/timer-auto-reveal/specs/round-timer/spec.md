# Spec Delta: Round Timer

## MODIFIED Requirements

### Requirement: Comportamiento no intrusivo al expirar tiempo
El sistema SHALL finalizar automáticamente la votación al llegar la cuenta regresiva a 00:00 de forma autoritativa en el servidor, revelando las cartas de todos los participantes y abriendo el modal interactivo de resultados inmediatamente como si se hubiese accionado la revelación manual, deteniendo cualquier temporizador activo cuando se realice una revelación manual anticipada.

#### Scenario: Expiración del temporizador
- **WHEN** la cuenta regresiva del temporizador llega a 00:00 sin haber sido detenida previamente
- **THEN** el servidor establece la ronda como revelada, detiene el temporizador y despliega automáticamente el modal de resultados con las métricas para todos los miembros de la sala, emitiendo el chime sonoro de finalización

#### Scenario: Revelación manual anticipada con temporizador activo
- **WHEN** el anfitrión activa la acción de revelar votos antes de que la cuenta regresiva llegue a 00:00
- **THEN** el sistema cancela el temporizador activo en servidor y clientes, revelando las cartas y abriendo el modal de resultados sin esperar a que el tiempo expire
