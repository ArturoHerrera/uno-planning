# Spec Delta: Room Management

## MODIFIED Requirements

### Requirement: Persistencia local de identidad
El sistema SHALL recordar el nombre y avatar asignado al usuario localmente en el navegador para evitar reingresos manuales constantes, permitiendo al usuario regenerar su avatar aleatorio en el lobby mediante un botón de dados estilizado que alterna entre colecciones y estilos diversos (como aventureros, robots y personajes ilustrados) para asegurar variedad visual, mostrando dicho avatar e insignia visible de `👑 Host` en la mesa y barra superior.

#### Scenario: Recuperación de nombre almacenado
- **WHEN** el usuario ingresa a la aplicación habiendo usado previamente la herramienta en ese navegador
- **THEN** el sistema autocompleta el campo de nombre con el valor guardado en `localStorage`

#### Scenario: Visualización clara de roles
- **WHEN** los participantes ingresan a la sala
- **THEN** la interfaz identifica claramente al anfitrión con insignia de corona dorada y distingue a los votantes y espectadores

#### Scenario: Generación y persistencia de avatar aleatorio
- **WHEN** un usuario hace clic en el botón de dados para cambiar de avatar o ingresa su nombre por primera vez
- **THEN** el sistema genera un avatar aleatorio con marcada diversidad en peinados, colores y colecciones visuales (`adventurer`, `bottts`, `avataaars`, etc.), actualizando el almacenamiento local y la vista previa del lobby
