# Spec Delta: Round Timer

## MODIFIED Requirements

### Requirement: Paisaje sonoro zen y control de silencio
El sistema SHALL reproducir un tic suave y sutil cada segundo durante toda la cuenta regresiva, incrementando suavemente su intensidad durante el último 25% del tiempo total de la ronda y concluyendo con un chime tranquilo al expirar el tiempo, permitiendo a cada usuario silenciar el audio localmente.

#### Scenario: Sonido de aviso sutil
- **WHEN** el temporizador está activo y el sonido no está silenciado
- **THEN** el navegador reproduce un tic suave de madera cada segundo, aumentando gradualmente su intensidad durante el 25% final de la duración de la ronda, y reproduce un chime armónico zen al llegar a cero

#### Scenario: Usuario activa modo silencioso
- **WHEN** un usuario hace clic en el botón de altavoz/silencio del widget del temporizador
- **THEN** la aplicación silencia todos los avisos sonoros de forma persistente en su sesión local
