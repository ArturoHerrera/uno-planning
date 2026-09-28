# Design: Mejoras de UX (Favicon, Logo Home, Gestión de Usuario y Timer Zen)

## Context

La aplicación UNO-PLANNING cuenta con frontend en React/Vite y backend en Express con Socket.IO sincronizado en memoria RAM. Actualmente, el flujo de usuario carece de un camino directo para volver al home desde el header de la sala, no permite limpiar fácilmente el nombre de usuario recordado en el Lobby, muestra el favicon genérico de Vite y no dispone de control de tiempo para agilizar rondas sin generar ansiedad.

## Goals / Non-Goals

**Goals:**
- Proporcionar un favicon temático nítido y representativo en formato SVG.
- Permitir retorno intuitivo al inicio/lobby haciendo clic en el logo del header.
- Permitir prellenado automático y borrado en 1 clic del nombre de usuario en `localStorage`.
- Implementar un temporizador de ronda sincronizado vía WebSockets en memoria, con opciones estándar de 20s, 40s, 60s y 80s y controles exclusivos para el anfitrión.
- Generar efectos sonoros zen y tranquilos mediante Web Audio API sintetizada (sin cargar archivos MP3 pesados que requieran ancho de banda o bloqueos de autoplay agresivos).
- Ofrecer botón local de silencio (Mute) para que cada usuario decida si escuchar los avisos sonoros.

**Non-Goals:**
- Forzar la revelación o bloqueo de cartas cuando el tiempo expire (el anfitrión mantiene la decisión humana de cuándo revelar o reiniciar).
- Persistencia del temporizador en base de datos.
- Sonidos estridentes o de alarma de emergencia.

## Decisions

### 1. Favicon SVG estilizado
- **Decisión**: Crear un SVG optimizado con fondo circular/tarjeta oscura, las 4 franjas icónicas de colores UNO (rojo `#EF4444`, azul `#3B82F6`, verde `#10B981`, amarillo `#F59E0B`) y la letra "U" estilizada en blanco al centro.
- **Alternativa descartada**: Usar archivos `.ico` o `.png` binarios que pesan más y pierden nitidez en pantallas de alta densidad.

### 2. Navegación al Home en Logo
- **Decisión**: Envolver el logo `UNO-PLANNING` en un botón accesible con estado hover sutil. Al hacer clic, invoca `handleLeaveRoom()`, limpiando la URL y regresando al Lobby.
- **Alternativa descartada**: Enlace `<a>` estándar que recargue la página por completo de forma brusca.

### 3. Limpieza de Nombre en Lobby
- **Decisión**: Agregar un botón de icono `X` visible dentro del input cuando hay texto escrito. Al presionarlo, limpia el input y elimina `poker_username` de `localStorage`.
- **Alternativa descartada**: Esperar que el usuario borre manualmente con la tecla backspace.

### 4. Sincronización del Timer en Backend vs Reloj del Cliente
- **Decisión**: El servidor almacena el estado del timer `{ duration: number, endsAt: number | null, isRunning: boolean }`. Cuando el anfitrión inicia el timer, el servidor calcula `endsAt = Date.now() + duration * 1000` y emite el estado a la sala. Los clientes calculan el tiempo restante localmente contra `endsAt`, logrando sincronía exacta sin desfase de latencia de red.
- **Alternativa descartada**: Emitir un tick por segundo desde el servidor por socket (genera tráfico de red innecesario y es susceptible a jitter).

### 5. Generación de Sonido Zen mediante Web Audio API
- **Decisión**: Sintetizar los sonidos usando la `AudioContext` nativa del navegador:
  - *Tick tranquilo*: Sonido percusivo de madera ("woodblock" suave / seno con envolvente rápida de 800Hz a 400Hz en 25ms, volumen muy bajo) solo en los últimos 5 segundos o cada segundo si se prefiere.
  - *Fin de tiempo*: Acorde suave estilo campana tibetana/chime (frecuencias armónicas 528Hz y 1056Hz con caída exponencial de 1.8 segundos).
- **Alternativa descartada**: Descargar archivos `.mp3` o `.wav` externos que pueden fallar por CORS, 404 o lentitud de red.

## Risks / Trade-offs

- **[Políticas de Autoplay del Navegador]** → La Web Audio API puede requerir interacción previa del usuario.
  *Mitigación*: Como el usuario ya interactúa al unirse a la sala, seleccionar cartas o alternar temas, el `AudioContext` se activa en el primer clic de la aplicación.
- **[Timer en segundo plano si la pestaña no está activa]** → Los navegadores reducen la frecuencia de `setInterval` en pestañas inactivas.
  *Mitigación*: Como el cálculo del tiempo restante se basa en `endsAt - Date.now()`, al volver a la pestaña el tiempo siempre está sincronizado al segundo exacto.
