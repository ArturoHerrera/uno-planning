# Spec: Round Timer

## Purpose

Proporciona un temporizador sincronizado y minimalista para limitar y marcar el ritmo de las rondas de estimación en tiempo real sin bloquear forzosamente el flujo ni generar ansiedad en el equipo.

## Requirements

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
El sistema SHALL finalizar automáticamente la votación al llegar la cuenta regresiva a 00:00 de forma autoritativa en el servidor, revelando las cartas de todos los participantes y abriendo el modal interactivo de resultados inmediatamente como si se hubiese accionado la revelación manual, deteniendo cualquier temporizador activo cuando se realice una revelación manual anticipada.

#### Scenario: Expiración del temporizador
- **WHEN** la cuenta regresiva del temporizador llega a 00:00 sin haber sido detenida previamente
- **THEN** el servidor establece la ronda como revelada, detiene el temporizador y despliega automáticamente el modal de resultados con las métricas para todos los miembros de la sala, emitiendo el chime sonoro de finalización

#### Scenario: Revelación manual anticipada con temporizador activo
- **WHEN** el anfitrión activa la acción de revelar votos antes de que la cuenta regresiva llegue a 00:00
- **THEN** el sistema cancela el temporizador activo en servidor y clientes, revelando las cartas y abriendo el modal de resultados sin esperar a que el tiempo expire

### Requirement: Paisaje sonoro zen y control de silencio
El sistema SHALL emitir avisos sonoros discretos organizados en hitos temporales durante la cuenta regresiva: un tono suave de inicio al arrancar el temporizador, un tono recordatorio discreto al cumplirse el 50% de la duración total, tics suaves de cuenta regresiva en cada uno de los últimos 5 segundos (5, 4, 3, 2, 1), y un chime armónico zen al expirar el tiempo (00:00), sin emitir sonidos continuos segundo a segundo durante el resto del intervalo y permitiendo a cada usuario silenciar el audio localmente.

#### Scenario: Sonido de aviso sutil
- **WHEN** el temporizador está activo y el sonido no está silenciado
- **THEN** el navegador reproduce un tono suave de inicio al comenzar la cuenta regresiva, un tono sutil al transcurrir el 50% de la duración, un tic suave en cada uno de los últimos 5 segundos restantes, y un chime armónico zen al llegar a cero, suprimiendo los tics continuos durante el resto del tiempo

#### Scenario: Usuario activa modo silencioso
- **WHEN** un usuario hace clic en el botón de altavoz/silencio del widget del temporizador
- **THEN** la aplicación silencia todos los avisos sonoros de forma persistente en su sesión local
