# Spec: Host Onboarding

## Purpose

Proporciona un tutorial guiado introductorio con efecto spotlight para el anfitrión (Scrum Master), explicando de forma concisa las funciones clave de la sala sin abrumar con texto excesivo.

## Requirements

### Requirement: Activación y persistencia del tutorial de anfitrión
El sistema SHALL permitir al usuario activar o desactivar la opción de tutorial de anfitrión desde el Lobby directamente asociado al bloque de creación de sala ("Crear Nueva Sala"), guardando la preferencia en `localStorage` de tal forma que una vez completado o desactivado, permanezca inactivo en futuras sesiones a menos que sea rehabilitado expresamente por el usuario.

#### Scenario: Anfitrión con tutorial activado ingresa a la sala
- **WHEN** un usuario ingresa a una sala como anfitrión con la opción de tutorial activada
- **THEN** la sala despliega el tutorial guiado spotlight oscureciendo el fondo y enfocando el primer paso

#### Scenario: Anfitrión con tutorial completado o desactivado
- **WHEN** un usuario ingresa como anfitrión habiendo completado previamente el tour o con la opción deshabilitada
- **THEN** el tutorial no se muestra automáticamente y la sala carga directamente en su estado operativo normal

### Requirement: Flujo interactivo con enfoque visual (Spotlight)
El sistema SHALL mostrar un recorrido guiado por etapas con un overlay oscuro y resaltado de alto contraste sobre el componente objetivo, presentando instrucciones claras y concisas de una o dos líneas, con controles para avanzar o cerrar el recorrido.

#### Scenario: Paso 1 - Explicación del temporizador
- **WHEN** inicia el tutorial de anfitrión
- **THEN** el sistema resalta el área del temporizador e indica brevemente: "Controla el tiempo de debate por historia."

#### Scenario: Paso 2 - Explicación del mazo de historias
- **WHEN** el anfitrión avanza al paso 2
- **THEN** el sistema resalta el panel del Mazo de Historias e indica: "Carga tu lista o enlaces de tareas a estimar."

#### Scenario: Paso 3 - Explicación de bajar cartas
- **WHEN** el anfitrión avanza al paso 3
- **THEN** el sistema resalta el botón de acción central e indica: "Revela los votos cuando el equipo esté listo para ver el consenso o discrepancias."

#### Scenario: Cierre o finalización del tutorial
- **WHEN** el anfitrión presiona "Entendido" en el último paso o decide salir del tour
- **THEN** el overlay se retira inmediatamente, se marca como completado en `localStorage` y la sala queda plenamente interactiva
