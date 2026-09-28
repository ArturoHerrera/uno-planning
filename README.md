# 🃏 Poker Planning UNO

Aplicación web de **Poker Planning** sencilla, elegante y minimalista, inspirada en la estética y diversión del juego de cartas **UNO**.

- **100% Efímero en memoria (RAM)**: Cero bases de datos. Al cerrarse la sala o reiniciarse el proceso, la memoria se libera.
- **Cero registros**: Solo ingresa tu nombre (se recuerda localmente vía `localStorage`).
- **Acceso remoto multi-red**: Sincronización instantánea mediante WebSockets con **Socket.io**.
- **Baraja Fibonacci estilo UNO**: Valores `0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89` con asignación aleatoria de los 4 colores de UNO (Rojo, Azul, Verde, Amarillo) y comodines `?` (Wild) y `☕` (Wild Draw / Pausa).
- **Cartas 3D con volteo (Flip 3D)**: Los votos se ocultan con el dorso oficial "POKER" y se revelan simultáneamente con animación 3D.
- **Gestión de Jira**: El anfitrión puede pegar una lista de enlaces de Jira para que todos los participantes tengan acceso directo con un clic.
- **Métricas y Consenso**: Cálculo automático de promedio, moda y lluvia de confeti en acuerdos unánimes.
- **Modo Espectador**: Participa en la reunión sin votar ni afectar promedios.

---

## 🚀 Despliegue en Render.com ($0.00 / Free Tier)

Este proyecto está configurado para desplegarse como un **Web Service gratuito** en [Render.com](https://render.com) sin necesidad de tarjeta de crédito:

1. Sube este repositorio a tu cuenta de **GitHub** o **GitLab**.
2. Inicia sesión en **Render.com** y presiona **"New +"** -> **"Web Service"** (o "Blueprint" usando el archivo `render.yaml`).
3. Conecta tu repositorio.
4. Configura los siguientes parámetros:
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
5. ¡Listo! Render te proporcionará una URL pública con HTTPS/WSS (ej. `https://tu-poker.onrender.com`).

---

## 💻 Ejecución Local

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Modo desarrollo:
   ```bash
   npm run dev
   ```
   - Abre `http://localhost:5173` en tu navegador.

3. Compilar y probar en modo producción:
   ```bash
   npm run build
   npm start
   ```
   - Abre `http://localhost:3000`.
