# Design: Mejoras de Sesión y Temas

## Context

Para hacer la herramienta 100% práctica en llamadas de refinamiento de equipos reales, se agregan flujos de asignación de puntos, un modal colectivo para cerrar cada votación, soporte de tema claro/oscuro y mejoras directas en la ergonomía de la interfaz.

## Goals / Non-Goals

**Goals:**
- Extractor de código desde URL pegada en `Lobby.jsx`.
- Botón de revelar con aspecto pop de carta/botón UNO (fondo `#ED1C24`, borde blanco de 3px, sombra dura y tipografía amarilla cursiva impactante).
- Modal interactivo de resultados `ResultsModal.jsx` abierto para todos al revelar, con selector de puntaje acordado para el anfitrión.
- Estructura de tareas con puntuación en el servidor: `tasks: Array<{ id: string, title: string, score: number | string | null }>`.
- Botones de navegación de tareas con texto descriptivo y badges de roles con iconos de corona (`👑 Host`).
- Tema Claro y Oscuro con variables CSS / clases Tailwind aplicadas al elemento raíz `<html>` o contenedor principal.

**Non-Goals:**
- Bases de datos persistentes (se mantiene 100% efímero en memoria).

## Decisions

- **Estructura de Tareas**: Migrar `room.tasks` de `string[]` a `Array<{ title: string, score: number | string | null }>` para recordar los puntos asignados durante toda la sesión.
- **Tema Claro / Oscuro**: Toggle con atributo `data-theme` o clase `dark` y estado React sincronizado con `localStorage`.
