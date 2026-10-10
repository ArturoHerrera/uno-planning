# Spec Delta: round-timer

## MODIFIED Requirements

### Requirement: Control de temporizador por el anfitrión
El sistema SHALL permitir exclusivamente al anfitrión de la sala configurar, iniciar, pausar y reiniciar un temporizador de ronda, ofreciendo duraciones predeterminadas de 20, 40, 60 y 80 segundos, y SHALL responder a eventos automáticos de pausa y reactivación originados por cartas de aclaración (`?`).

#### Scenario: Anfitrión selecciona duración e inicia temporizador
- **WHEN** el anfitrión selecciona una duración (20s, 40s, 60s u 80s) y presiona iniciar temporizador
- **THEN** el servidor sincroniza el timestamp de finalización con todos los participantes y comienza la cuenta regresiva en tiempo real

#### Scenario: Anfitrión pausa o reinicia el temporizador
- **WHEN** el anfitrión presiona pausar o reiniciar durante una cuenta regresiva activa
- **THEN** el estado actualizado se propaga inmediatamente a todos los clientes de la sala

#### Scenario: Pausa automática por carta de duda
- **WHEN** un participante juega la carta `?`
- **THEN** el temporizador pasa inmediatamente al estado en pausa registrando los segundos restantes en el servidor

#### Scenario: Participante no anfitrión observa el temporizador
- **WHEN** un participante regular visualiza la sala
- **THEN** observa el avance sincronizado del reloj y la barra de progreso, pero los controles de configuración permanecen deshabilitados u ocultos
