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
El sistema SHALL reproducir un tic suave y sutil cada segundo durante toda la cuenta regresiva, incrementando suavemente su intensidad durante el último 25% del tiempo total de la ronda y concluyendo con un chime tranquilo al expirar el tiempo, permitiendo a cada usuario silenciar el audio localmente.

#### Scenario: Sonido de aviso sutil
- **WHEN** el temporizador está activo y el sonido no está silenciado
- **THEN** el navegador reproduce un tic suave de madera cada segundo, aumentando gradualmente su intensidad durante el 25% final de la duración de la ronda, y reproduce un chime armónico zen al llegar a cero

#### Scenario: Usuario activa modo silencioso
- **WHEN** un usuario hace clic en el botón de altavoz/silencio del widget del temporizador
- **THEN** la aplicación silencia todos los avisos sonoros de forma persistente en su sesión local
