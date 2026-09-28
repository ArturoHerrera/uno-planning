# Tasks

## 1. Correcciones Críticas de Frontend y Estabilidad React

- [x] 1.1 Reorganizar hooks incondicionalmente en `client/src/components/ResultsModal.jsx` para corregir violación de *Rules of Hooks* y verificar con `npm --prefix client run lint` (0 errores).
- [x] 1.2 Implementar gestión de reconexión transparente y auto-rejoin en `client/src/App.jsx` guardando y enviando `hostToken` en `sessionStorage`, y verificar con `npm --prefix client run build`.

## 2. Hardening del Servidor y Control de Acceso

- [x] 2.1 Instalar dependencia `helmet` en `package.json` y configurar cabeceras de seguridad HTTP y CSP en `server/index.js`, verificando que el servidor responda con cabeceras `nosniff` y `SAMEORIGIN`.
- [x] 2.2 Reemplazar generación débil de ID de sala por generador seguro con `node:crypto` y bucle anti-colisión en `server/index.js`, verificando que no se sobrescriban salas existentes.
- [x] 2.3 Implementar generación, emisión y validación de `hostToken` para preservar el rol de anfitrión ante desconexiones y verificar que solo el anfitrión autenticado pueda revelar o reiniciar rondas.
- [x] 2.4 Implementar validación y whitelist de votos (rechazo de `NaN`, `Infinity` y valores ajenos a la baraja UNO), cuota de participantes (máximo 30 por sala) y cuotas de tareas (máximo 50 tareas de hasta 300 caracteres).
- [x] 2.5 Implementar limitador de tasa de eventos (*socket rate limiting*) para reacciones y votos, así como un recolector programado (*Janitor*) de salas inactivas tras 8 horas.

## 3. Suite Automatizada de Pruebas de Seguridad y Verificación

- [x] 3.1 Crear la suite de pruebas automatizadas `server/test-security.js` para simular ataques de envenenamiento numérico, task-bombing, ráfagas de reacciones, anti-colisión de IDs y recuperación de host con token.
- [x] 3.2 Añadir el comando `npm run test:security` en `package.json` y verificar que todos los vectores de ataque sean neutralizados con éxito (código de salida 0).
- [x] 3.3 Ejecutar la suite completa de pruebas E2E `node server/test-e2e.js` y el lint del cliente para asegurar que el sistema esté al 100% libre de regresiones antes del PR.
