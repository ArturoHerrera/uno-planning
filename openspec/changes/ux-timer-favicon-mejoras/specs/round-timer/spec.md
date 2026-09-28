# Spec Delta: Round Timer

## Purpose

Proporciona un temporizador sincronizado y minimalista para limitar y marcar el ritmo de las rondas de estimación en tiempo real sin bloquear forzosamente el flujo ni generar ansiedad en el equipo.

## ADDED Requirements

### Requirement: Control de temporizador por el anfitrión
El sistema SHALL permitir exclusivamente al anfitrión de la sala configurar, iniciar, pausar y reiniciar un temporizador de ronda, ofreciendo duraciones predeterminadas de 20, 40, 60 y 80 segundos.

#### Scenario: Anfitrión selecciona duración e inicia temporizador
- **WHEN** el anfitrión selecciona una duración (20s, 40s, 60s u 80s) y presiona iniciar temporizador
- **THEN** el servidor sincroniza el timestamp de finalización con todos los participantes y comienza la cuenta regresiva en tiempo real

#### Scenario: Anfitrión pausa o reinicia el temporizador
- **WHEN** el anfitrión presiona pausar o reiniciar durante una cuenta regresiva activa
- **THEN** el estado actualizado se propaga inmediatamente a todos los clientes de la sala

#### Scenario: Participante no anfitrión observa el temporizador
- **WHEN** un participante regular visualiza la sala
- **THEN** observa el avance sincronizado del reloj y la barra de progreso, pero los controles de configuración permanecen deshabilitados u ocultos

### Requirement: Comportamiento no intrusivo al expirar tiempo
El sistema SHALL finalizar la cuenta regresiva indicando visualmente que el tiempo terminó sin forzar la revelación automática de los votos ni penalizar a quienes no hayan emitido su carta.

#### Scenario: Expiración del temporizador
- **WHEN** la cuenta regresiva llega a 00:00
- **THEN** el temporizador muestra el estado de tiempo agotado, manteniendo las cartas en su estado actual para que el anfitrión decida cuándo revelar o reiniciar la ronda

### Requirement: Paisaje sonoro zen y control de silencio
El sistema SHALL reproducir sonidos ambientales relajantes (tic-tac tenue de madera en el tramo final y chime tranquilo al culminar), permitiendo a cada usuario silenciar el audio localmente.

#### Scenario: Sonido de aviso sutil
- **WHEN** el temporizador está activo en los últimos segundos o llega a cero y el sonido no está silenciado
- **THEN** el navegador reproduce un tono relajante sintetizado mediante Web Audio API

#### Scenario: Usuario activa modo silencioso
- **WHEN** un usuario hace clic en el botón de altavoz/silencio del widget del temporizador
- **THEN** la aplicación silencia todos los avisos sonoros de forma persistente en su sesión local
