# Spec Delta: Room Management

## MODIFIED Requirements

### Requirement: Creación y unión a salas
El sistema SHALL permitir a cualquier usuario crear una nueva sala con un identificador único generado mediante entropía criptográfica segura garantizando la ausencia de colisiones o sobrescrituras destructivas en memoria, o unirse a una sala existente mediante dicho código o enlace directo, reconociendo y extrayendo automáticamente el código si el usuario pega una URL completa, limitando la capacidad de la sala a un máximo de 30 participantes simultáneos para prevenir ataques de denegación de servicio.

#### Scenario: Usuario crea una nueva sala
- **WHEN** un usuario ingresa su nombre y selecciona "Crear Sala"
- **THEN** el sistema genera una sala con identificador criptográficamente seguro sin colisión con salas activas, crea la sala en memoria, emite un token de anfitrión seguro (`hostToken`), le asigna el rol de anfitrión (host) y le redirige a la vista de la sala

#### Scenario: Usuario se une a una sala existente mediante URL
- **WHEN** un participante navega a la URL de una sala existente e introduce su nombre
- **THEN** el sistema lo conecta a la sesión en tiempo real y notifica a todos los miembros de la sala su presencia siempre que la sala no haya excedido el límite de 30 participantes

#### Scenario: Usuario pega URL completa en el campo de código
- **WHEN** un usuario pega un enlace con parámetro `?room=CODIGO` en el campo de código de sala
- **THEN** el sistema extrae automáticamente solo el código alfanumérico para facilitar la unión sin errores

#### Scenario: Prevención de sobrescritura por colisión de IDs
- **WHEN** se solicita la creación de una sala cuyo identificador ya se encuentra ocupado en memoria
- **THEN** el sistema reintenta la generación de un identificador alternativo libre sin alterar ni sobrescribir la sala preexistente

#### Scenario: Límite de capacidad máxima por sala
- **WHEN** un participante intenta unirse a una sala que ya cuenta con 30 participantes conectados
- **THEN** el sistema rechaza la conexión con un mensaje indicando que la sala ha alcanzado su capacidad máxima

### Requirement: Persistencia local de identidad
El sistema SHALL recordar el nombre y avatar asignado al usuario localmente en el navegador, así como mantener un token de anfitrión (`hostToken`) en el almacenamiento de sesión (`sessionStorage`) que permita preservar o revalidar los privilegios de anfitrión de forma autorizada ante recargas de página o reconexiones de red, evitando el secuestro de sala.

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

#### Scenario: Reconexión o recarga de página del anfitrión
- **WHEN** el anfitrión de una sala recarga el navegador o experimenta un parpadeo de red que renueva su conexión de Socket.IO
- **THEN** el sistema valida el token de anfitrión presentado y restaura automáticamente sus privilegios de administración sin delegar la sala a otro participante

## ADDED Requirements

### Requirement: Reconexión resiliente y auto-rejoin de clientes
El sistema SHALL detectar la reconexión exitosa del transporte de Socket.IO en el cliente y solicitar automáticamente la reincorporación a la sala activa sin requerir intervención manual del usuario.

#### Scenario: Pérdida temporal de enlace y reconexión de socket
- **WHEN** la conexión WebSocket se interrumpe y Socket.IO completa una reconexión exitosa
- **THEN** el cliente emite automáticamente un evento de reincorporación con el identificador de sala y credenciales de sesión, sincronizando el estado más reciente de la partida

### Requirement: Purga programada de salas inactivas (Janitor)
El servidor SHALL inspeccionar periódicamente la memoria y desalojar salas inactivas que superen un tiempo de vida (TTL) de 8 horas sin actividad para evitar fugas de memoria por sesiones zombi.

#### Scenario: Limpieza de sala inactiva tras TTL
- **WHEN** una sala no registra eventos ni participantes durante más de 8 horas
- **THEN** el servidor libera completamente de la memoria el estado y los temporizadores asociados a dicha sala
