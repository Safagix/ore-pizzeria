# 📘 El Manual Maestro de Desarrollo de Software

**Objetivo:** Guía universal paso a paso para transformar una idea en software profesional, seguro y escalable.  
**Nivel:** Desde Principiante hasta Profesional.  
**Filosofía:** "Código limpio, secretos seguros y deployments automáticos".

---

## 🗺️ El Mapa del Tesoro (Ciclo de Vida)

Todo software exitoso sigue estas 8 fases. No te saltes ninguna.

| Fase | Nombre | Objetivo Clave | Herramienta Estrella |
| :--- | :--- | :--- | :--- |
| **1** | 📝 Planificación | Definir QUÉ y PARA QUIÉN. | Plane |
| **2** | 📋 Requerimientos | Escribir las reglas del juego (PRD). | Notion / Markdown |
| **3** | 🎨 Diseño | Visualizar antes de construir. | Figma |
| **4** | 💻 Programación | Traducir diseño a código. | VS Code / Git |
| **5** | 🛠️ Testing | Romperlo antes que el usuario. | Playwright |
| **6** | 🚀 Deployment | Llevarlo al mundo real (Producción). | Vercel / Railway |
| **7** | 📈 Mantenimiento | Mantenerlo vivo y sano. | Sentry |
| **8** | 🔄 Evolución | Mejorar basado en uso real. | Posthog |

---

## FASE 4: 💻 Programación e Infraestructura (La Base)

Antes de escribir una línea de código lógica, necesitas cimientos sólidos.

### 1. Control de Versiones (Git)

Nunca trabajes sin "puntos de guardado".

- **`git init`**: Crea el universo de tu proyecto.
- **`.gitignore`**: El portero. Define qué NO entra (claves, archivos basura).
- **`git add .` + `git commit`**: Guarda una foto del estado actual.

### ⚠️ Lección Crítica: Manejo de Rutas

Si tu carpeta tiene espacios (ej: `Mi Proyecto`), la terminal se confundirá.

- ❌ Mal: `cd D:\Mi Proyecto`
- ✅ Bien: `cd "D:\Mi Proyecto"` (Usa siempre comillas).

---

## FASE 6: 🚀 Deployment Avanzado (Secretos y Nube)

Aquí es donde la mayoría falla. Tu código local funciona, pero en la nube se rompe. ¿Por qué? **Secretos**.

### El Problema de las Llaves (API Keys)

Tus credenciales de base de datos (Firebase, Supabase) **NUNCA** deben subirse a GitHub. Si lo haces, hackers te robarán el acceso en segundos.

### La Solución: Variables de Entorno

1. **Local:** Guardas tus claves en un archivo `js/config.js` o `.env` que está en tu `.gitignore`.
2. **Nube (Vercel/Railway):** Escribes las claves manualmente en el panel de configuración del servidor.

### 🎓 Caso de Estudio: Frontend Estático (HTML/JS)

En sitios sin backend (como un HTML simple), no puedes leer `.env` directamente.

**El Patrón "Generador de Configuración":**
Este truco profesional permite usar variables seguras en sitios estáticos.

1. **Crea un script `generate_config.js`:**
   Este script se ejecuta *durante el deploy*. Lee las variables del servidor y crea el archivo `js/config.js` al vuelo.

   ```javascript
   // generate_config.js
   const fs = require('fs');
   const configContent = `const CONFIG = {
       apikey: "${process.env.MI_API_KEY}"
   };`;
   fs.writeFileSync('./js/config.js', configContent);
   ```

2. **Configura el comando de Build:**
   En `vercel.json`, dile al servidor que corra este script antes de publicar:

   ```json
   { "buildCommand": "node generate_config.js" }
   ```

3. **Resultado:** Tu código en GitHub es seguro (sin claves), pero tu web en Vercel funciona perfecto (con claves inyectadas).

---

## 🚑 Troubleshooting (Solución de Problemas Reales)

Errores que te pasarán sí o sí, y cómo arreglarlos.

### 🛑 "Git Identity Unknown"

**Síntoma:** Intentas hacer commit y Git te grita "Please tell me who you are".
**Solución:** Git necesita saber a quién culpar.

```bash
git config --global user.email "tu@email.com"
git config --global user.name "TuNombre"
```

### 🛑 "Infinite Loading" en Producción

**Síntoma:** Tu web funciona en local, pero en Vercel se queda cargando (spinner eterno).
**Causa:** El servidor no tiene acceso a tus claves (porque `config.js` está ignorado).
**Solución:**

1. Ve a Vercel > Settings > Environment Variables.
2. Agrega tus claves una por una (copia y pega desde tu local).
3. Haz un nuevo deploy (o push) para que tome los cambios.

### 🛑 "Terminal irreconocible"

**Síntoma:** PowerShell dice que `git` no se reconoce.
**Solución:** Instalaste Git pero no reiniciaste. Cierra VS Code y la terminal, y ábrelos de nuevo.

---

## 🛠️ Herramientas Recomendadas (Stack 2026)

- **Editor:** VS Code o Cursor (IA integrada).
- **Frontend:** HTML/JS (Básico) o Next.js (Profesional).
- **Backend:** Firebase (Rápido) o Supabase (SQL Robusto).
- **Hosting:** Vercel (Frontend) + Railway (Backend).
- **Diseño:** Figma.
- **Gestión:** Plane.so.

---

### ✅ Checklist Final antes del Éxito

- [ ] Código protegido en GitHub (Repo Privado).
- [ ] `.gitignore` incluye `.env`, `node_modules` y archivos de config secretos.
- [ ] Manual de Testing creado y ejecutado al menos una vez.
- [ ] Backups de base de datos planificados.
- [ ] README.md explica cómo instalar y correr el proyecto.

*Este manual es un documento vivo. Actualízalo con cada error nuevo que soluciones.*
