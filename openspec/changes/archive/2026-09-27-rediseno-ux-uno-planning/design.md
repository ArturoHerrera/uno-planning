# Design: Rediseño UX UNO-PLANNING

## Context

A partir del feedback del usuario con capturas reales de la sesión, se detectaron mejoras clave de usabilidad:
1. Las cartas de la mano inferior desbordaban el ancho y quedaban cortadas verticalmente.
2. Los valores 55 y 89 son excesivos para un refinamiento ágil efectivo.
3. La interfaz horizontal actual no aprovecha el espacio disponible; una distribución en dos columnas (70% mesa y cartas / 30% lista de tareas fija) ofrece mayor claridad y agilidad.
4. Se busca una identidad visual más moderna, usando gradientes profundos, transparencias suaves y espacio negativo, eliminando las líneas/bordes duros.

## Goals / Non-Goals

**Goals:**
- Ajustar el mazo de cartas a 11 elementos: `0, 1, 2, 3, 5, 8, 13, 21, 34, ?, ☕`.
- Escalar la mano de cartas a dimensiones balanceadas (`w: 76px`, `h: 114px` en escritorio) con flex-wrap/centrado para que nunca se corte ninguna carta.
- Diseñar un layout en dos columnas (grid `lg:grid-cols-7` con `lg:col-span-5` para mesa y `lg:col-span-2` para el panel de tareas lateral).
- Sustituir bordes oscuros rígidos por fondos translúcidos `bg-white/[0.04]` con sombras difusas `shadow-2xl` y fondo general `bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950`.
- Renombrar a "UNO-PLANNING".

**Non-Goals:**
- Cambiar la lógica del backend (se mantiene intacto).

## Decisions

- **Layout Grid**: Usar CSS Grid moderno de 7 columnas en escritorio (`grid grid-cols-1 lg:grid-cols-7 gap-6`), permitiendo que en pantallas móviles o tablets se apile naturalmente.
- **Side Panel de Tareas**: Panel siempre visible que muestra el listado de tickets, con indicador de tarea activa y botón rápido para agregar tickets o navegar entre ellos.
- **Glassmorphism sin bordes duros**: Reemplazar clases `border border-slate-800` por `bg-slate-900/40 backdrop-blur-xl shadow-xl`.
