# Spec Delta: Room Management

## MODIFIED Requirements

### Requirement: Persistencia local de identidad
El sistema SHALL recordar el nombre y avatar asignado al usuario localmente en el navegador para evitar reingresos manuales constantes, permitiendo al usuario regenerar su avatar aleatorio en el lobby mediante un botón de dados estilizado que alterna entre colecciones y estilos diversos, y ofreciendo un botón de limpieza rápida para borrar el nombre recordado tanto del campo de entrada como del almacenamiento local (`localStorage`), mostrando dicho avatar e insignia visible de `👑 Host` en la mesa y barra superior.

#### Scenario: Recuperación de nombre almacenado
- **WHEN** el usuario ingresa a la aplicación habiendo usado previamente la herramienta en ese navegador
- **THEN** el sistema autocompleta el campo de nombre con el valor guardado en `localStorage`

#### Scenario: Limpieza de nombre almacenado
- **WHEN** el usuario hace clic en el botón de limpiar/borrar junto al campo de nombre en el Lobby
- **THEN** el sistema vacía el campo de texto y elimina la clave `poker_username` de `localStorage`

#### Scenario: Visualización clara de roles
- **WHEN** los participantes ingresan a la sala
- **THEN** la interfaz identifica claramente al anfitrión con insignia de corona dorada y distingue a los votantes y espectadores

#### Scenario: Generación y persistencia de avatar aleatorio
- **WHEN** un usuario hace clic en el botón de dados para cambiar de avatar o ingresa su nombre por primera vez
- **THEN** el sistema genera un avatar aleatorio con marcada diversidad en peinados, colores y colecciones visuales (`adventurer`, `bottts`, `avataaars`, etc.), actualizando el almacenamiento local y la vista previa del lobby

## ADDED Requirements

### Requirement: Navegación al inicio desde cabecera
El sistema SHALL permitir al usuario salir de la sala activa y regresar al Lobby principal al interactuar con el logo o título `UNO-PLANNING` en la cabecera superior.

#### Scenario: Clic en el logo de cabecera
- **WHEN** un participante o anfitrión hace clic en el logo `UNO-PLANNING` dentro de una sala
- **THEN** el sistema desconecta al usuario de la sala activa, limpia el parámetro de consulta `?room` de la URL y presenta la vista de Lobby para unirse o crear otra sala
