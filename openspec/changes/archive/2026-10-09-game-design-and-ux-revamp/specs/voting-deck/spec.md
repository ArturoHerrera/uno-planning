# Spec Delta: voting-deck

## MODIFIED Requirements

### Requirement: Emisión y cambio de voto
El sistema SHALL permitir al participante seleccionar una carta para emitir su voto o cambiar su selección antes de que la ronda sea revelada, emitiendo retroalimentación sonora sutil de colocación de carta (*card snap*) y distinguiendo visualmente en la mesa entre participantes que están listos y aquellos que aún están pensando.

#### Scenario: Selección de carta y retroalimentación táctil/sonora
- **WHEN** un participante hace clic en una carta de su mano
- **THEN** la carta queda marcada como seleccionada en su interfaz, se reproduce un sonido sutil de carta colocada sobre la mesa, y el resto de los participantes observan en la mesa la carta boca abajo con un distintivo prominente de "Listo"

#### Scenario: Participante en espera de emitir su voto
- **WHEN** un participante activo aún no ha seleccionado carta durante una ronda abierta
- **THEN** su lugar en la mesa exhibe una ranura vacía con la indicación animada "Pensando...", permitiendo al resto del equipo identificarlo y reaccionar con emojis
