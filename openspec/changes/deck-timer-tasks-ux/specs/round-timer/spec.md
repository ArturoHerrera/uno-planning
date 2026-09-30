# Spec Delta: Round Timer

## MODIFIED Requirements

### Requirement: Paisaje sonoro zen y control de silencio
El sistema SHALL emitir avisos sonoros discretos organizados en hitos temporales durante la cuenta regresiva: un tono suave de inicio al arrancar el temporizador, un tono recordatorio discreto al cumplirse el 50% de la duración total, tics suaves de cuenta regresiva en cada uno de los últimos 5 segundos (5, 4, 3, 2, 1), y un chime armónico zen al expirar el tiempo (00:00), sin emitir sonidos continuos segundo a segundo durante el resto del intervalo y permitiendo a cada usuario silenciar el audio localmente.

#### Scenario: Sonido de aviso sutil
- **WHEN** el temporizador está activo y el sonido no está silenciado
- **THEN** el navegador reproduce un tono suave de inicio al comenzar la cuenta regresiva, un tono sutil al transcurrir el 50% de la duración, un tic suave en cada uno de los últimos 5 segundos restantes, y un chime armónico zen al llegar a cero, suprimiendo los tics continuos durante el resto del tiempo

#### Scenario: Usuario activa modo silencioso
- **WHEN** un usuario hace clic en el botón de altavoz/silencio del widget del temporizador
- **THEN** la aplicación silencia todos los avisos sonoros de forma persistente en su sesión local
