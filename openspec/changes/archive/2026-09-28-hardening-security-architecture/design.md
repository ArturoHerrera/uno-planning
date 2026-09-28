# Design: Hardening de Ciberseguridad y Arquitectura de Sistemas

## Context

La aplicación opera con un backend Node.js/Express y Socket.IO en memoria (RAM efímera), pensado para desplegarse en instancias cloud como Render (plan Free de 512MB RAM). Ver `proposal.md` para la motivación. El diseño debe mantener la naturaleza ligera y sin base de datos persistente (cero dependencias externas complejas como PostgreSQL o Redis para esta fase), pero elevando la seguridad a nivel de producción.

## Goals / Non-Goals

**Goals:**
- Generación de identificadores de sala resistentes a colisión y predicción mediante entropía del sistema operativo (`node:crypto`).
- Autenticación autoritativa de anfitrión basada en tokens de sesión (`hostToken`), resistentes a recarga de página (F5) o desconexiones efímeras de Socket.IO.
- Mitigación efectiva de DoS a nivel de aplicación (límites de participantes, tareas, caracteres y rate limiting en eventos en tiempo real).
- Protección de cabeceras HTTP mediante `helmet` y restricción razonable de CORS para entornos de producción.
- Corrección de la violación de *Rules of Hooks* en React 19 para garantizar estabilidad en cliente.
- Auto-reincorporación de clientes Socket.IO tras micro-cortes de red.
- Suite de pruebas de seguridad automatizada (`test-security.js`).

**Non-Goals:**
- Introducir bases de datos SQL/NoSQL o Redis (la aplicación continuará siendo efímera y basada en memoria RAM).
- Sistema de autenticación de usuarios con contraseña o OAuth (las salas siguen siendo accesibles por enlace).
- Soporte para escalado horizontal multi-instancia en este cambio (requeriría Redis pub/sub; se mantiene mono-proceso optimizado).

## Decisions

### 1. Generación de Room IDs con `node:crypto` y Loop Anti-Colisión
- **Decisión:** Usar `crypto.randomBytes(4).toString('hex').toUpperCase().slice(0, 6)` garantizando que `while (rooms.has(roomId))` nunca se sobrescriba una sala existente.
- **Alternativa considerada:** Mantener `Math.random()`. Descartado por ser predecible y susceptible a colisiones destructivas.
- **Alternativa considerada:** UUID v4 completo (36 caracteres). Descartado por degradar la experiencia de usuario al compartir códigos legibles verbalmente. 6 caracteres hex (16.7 millones de combinaciones) con verificación de colisión es suficiente para salas efímeras.

### 2. Autenticación de Host mediante `hostToken`
- **Decisión:** Al emitir `room:create`, el servidor genera un token criptográfico `hostToken = crypto.randomBytes(16).toString('hex')`.
  - El servidor guarda el `hostToken` en la estructura interna de la sala.
  - El anfitrión almacena el `hostToken` en `sessionStorage` (scoped a la pestaña del navegador).
  - Al reconectar el socket o enviar acciones administrativas (`round:reveal`, `round:reset`, `task:*`, `timer:*`), el cliente envía el `hostToken` (o el socket asociado autenticado).
  - Si el socket del host se desconecta temporalmente, la sala entra en un breve periodo de gracia (30 segundos) antes de delegar el rol, y el creador puede recuperar el rol inmediatamente si presenta el `hostToken` válido.
- **Alternativa considerada:** Identificar únicamente por IP. Descartado porque múltiples miembros en una misma oficina comparten IP pública (NAT).

### 3. Rate Limiting en memoria para Sockets (Token Bucket / Sliding Window)
- **Decisión:** Implementar un limitador en memoria liviano por socket:
  - Max 5 reacciones por segundo.
  - Max 10 votos por segundo.
  - Bloqueo silencioso de paquetes en exceso sin crashear el servidor.
- **Alternativa considerada:** Dependencia externa como `rate-limiter-flexible` con Redis. Descartado por sobrecarga de dependencias innecesarias en una app monolítica ligera.

### 4. Cabeceras HTTP con `helmet`
- **Decisión:** Instalar y configurar `helmet` con Content-Security-Policy adaptada a Vite (`connect-src` a sí mismo y WebSockets, `img-src` permitiendo Dicebear `api.dicebear.com` y blobs SVG/data).

### 5. Corrección de Hooks en `ResultsModal.jsx`
- **Decisión:** Reorganizar `ResultsModal.jsx` para declarar todos los hooks (`useState`, `useEffect`) incondicionalmente en la cabecera del componente. El renderizado condicional se maneja dentro del JSX o en el return final.

## Risks / Trade-offs

- **[Riesgo de salas zombi en memoria]** → Mitigación: Un cron ligero interno (`setInterval` cada hora) que purgue salas cuya última actividad supere las 8 horas.
- **[Riesgo de CSP restrictiva bloqueando avatares o sonidos]** → Mitigación: Configurar específicamente `img-src 'self' data: https://api.dicebear.com` y `media-src 'self' data:` en la directiva de Helmet.
- **[Riesgo de falsos positivos en reconexión]** → Mitigación: El `hostToken` solo tiene vigencia durante la vida de la sala en memoria. Al destruirse la sala, el token queda invalidado.
