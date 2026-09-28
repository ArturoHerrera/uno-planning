# 🚀 Guía de Despliegue en Render: UNO-PLANNING

Esta guía deja documentado paso a paso el proceso de despliegue para que puedas continuarlo en cualquier momento.

---

## 📌 En la pantalla de Render donde estás ahora:

1. **Seleccionar tipo de servicio**:
   - En la cuadrícula de opciones que ves en pantalla, haz clic en **`Web Services`** (la segunda tarjeta de la primera fila: *"Dynamic web app. Ideal for full-stack apps..."*).

2. **Conectar Repositorio**:
   - Elige **"Build and deploy from a Git repository"**.
   - Conecta tu cuenta de GitHub (si aún no diste permisos al repo, pulsa en *"Configure account"* y dale acceso a `ArturoHerrera/uno-planning`).
   - Selecciona el repositorio **`uno-planning`**.

3. **Completar los Parámetros de Configuración**:
   - **Name**: `uno-planning` (o el subdominio que prefieras).
   - **Region**: La más cercana (ejemplo: `Ohio (US East)` o `Oregon (US West)`).
   - **Branch**: `main`
   - **Root Directory**: *(dejar en blanco)*
   - **Runtime**: `Node`
   - **Build Command**:
     ```bash
     npm install && npm run build
     ```
   - **Start Command**:
     ```bash
     npm start
     ```
   - **Instance Type**: Selecciona **`Free`** ($0/month).

4. **Variables de entorno (Environment Variables)**:
   - Si te da la opción de agregar variables opcionales:
     - `NODE_ENV` = `production`

5. **Lanzar el despliegue**:
   - Haz clic en **"Deploy Web Service"** al final de la página.

---

## ⏱️ ¿Qué pasará durante el despliegue?
1. Render clonará el repositorio desde la rama `main`.
2. Ejecutará `npm install` instalando tanto Express y Socket.IO como las dependencias de Vite.
3. Ejecutará `npm run build` que compila el frontend en `client/dist`.
4. Ejecutará `npm start` iniciando el servidor Node en el puerto que Render le asigne (`PORT`).
5. Te generará un enlace público HTTPS:
   ```
   https://uno-planning-xxxx.onrender.com
   ```

---

## 📝 Notas importantes:
- **WebSockets activos**: Socket.IO funcionará automáticamente sobre `wss://` sin necesidad de configuraciones extra.
- **Modo Suspensión (Free Tier)**: Tras 15 minutos sin uso, la app entra en reposo. Al abrir el link, tardará ~30-40 segundos en reactivarse la primera vez.
