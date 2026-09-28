# Design

## Context

El proyecto requiere una aplicación web de Poker Planning con sincronización en tiempo real entre múltiples dispositivos y redes, con cero base de datos externa, estado 100% efímero en memoria y costo $0 de infraestructura (diseñado para el tier gratuito de Render.com). La experiencia de usuario debe ser minimalista, elegante y con una identidad visual inspirada en la geometría y colores de las cartas de UNO.

## Goals / Non-Goals

**Goals:**
- Implementar una arquitectura monorepo ligera (Node.js + Express + Socket.io en el backend; React + Vite + Tailwind/CSS en el frontend).
- Gestionar salas efímeras en memoria (`Map<roomId, RoomState>`) con auto-limpieza tras desconexión.
- Crear componentes visuales SVG/CSS para las cartas de Fibonacci (`0` al `89`, `?` y `☕`) replicando la geometría de UNO (óvalo central inclinado, números en esquina, borde redondeado y colores aleatorios).
- Efecto de revelación simultánea con animación de volteo (*Flip 3D*) y cálculo inmediato de estadísticas (promedio, consenso y moda).
- Soporte para cola de tareas de Jira con enlace clickable y controles de navegación para el anfitrión.
- Configurar el build y arranque unificado para despliegue directo en Render.com con $0 de costo.

**Non-Goals:**
- Almacenamiento persistente en bases de datos (SQL/NoSQL) ni histórico de votaciones entre sesiones.
- Autenticación pesada con contraseñas o proveedores OAuth (solo nombre en `localStorage`).
- Integración vía API directa con Jira/OAuth (se maneja por URLs o enlaces pegados por el anfitrión).

## Decisions

### 1. Monolito Fullstack ligero en Node.js + Express + Socket.io
- **Decisión**: Un único servidor Express que sirve los archivos estáticos generados por Vite y aloja el servidor de WebSockets de Socket.io en el mismo puerto (`process.env.PORT`).
- **Alternativas consideradas**:
  - *Frontend en Vercel + Backend en Render separado*: Mayor complejidad de CORS, dos servicios que desplegar y mantener.
  - *WebRTC P2P*: Riesgos de fallo en redes corporativas con NAT simétrico sin servidores TURN dedicados.
- **Razón**: Máxima simplicidad de despliegue en un solo paso (`git push` a Render), cero problemas de CORS y costo cero.

### 2. Estado efímero en memoria (RAM)
- **Decisión**: Cada sala se modela como un objeto en un `Map` en el servidor:
  ```ts
  interface RoomState {
    id: string;
    hostId: string;
    participants: Map<string, Participant>;
    tasks: string[];
    currentTaskIndex: number;
    revealed: boolean;
  }
  ```
- **Alternativas consideradas**: Redis / Upstash (añade dependencias y límites de conexión/tokens externos).
- **Razón**: Cumple estrictamente con el requisito de que al cerrarse la sala o reiniciarse el proceso, todos los datos se destruyen sin dejar rastro ni costo.

### 3. Cartas vectoriales estilo UNO mediante componentes React SVG
- **Decisión**: Renderizar las cartas usando componentes SVG dinámicos puros en lugar de imágenes rasterizadas (PNG/JPG).
- **Razón**: Cero peso en red, escalabilidad vectorial perfecta, control total de los colores aleatorios (rojo `#ED1C24`, azul `#0054A6`, verde `#54B948`, amarillo `#FFDE00`, comodín negro/arcoíris) y soporte nativo para efectos de elevación (*hover lift*) y volteo (*flip 3D* con CSS `transform-style: preserve-3d`).

### 4. Persistencia del lado del cliente en `localStorage`
- **Decisión**: Almacenar `{ userName: string, lastRoomId?: string }` en `localStorage` del navegador.
- **Razón**: Entrada instantánea sin pasos de login; si el usuario recarga la pestaña, se reconecta automáticamente con su mismo nombre y estado.

## Risks / Trade-offs

- **[Riesgo: Sleep del Free Tier de Render tras 15 min de inactividad]** → *Mitigación*: Notificar al usuario con un indicador de estado visual ("Conectando a la sala...") si el servidor está despertando; una vez conectado, la sesión es continua sin pausas.
- **[Riesgo: Pérdida del anfitrión por desconexión accidental]** → *Mitigación*: Si el anfitrión se desconecta, se mantiene una ventana de gracia breve para reconexión con el mismo nombre/id o se promueve automáticamente al siguiente participante más antiguo como anfitrión de respaldo.
