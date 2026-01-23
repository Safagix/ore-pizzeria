# 🍕 Ore Pizzeria - Sistema POS

Sistema de punto de venta para pizzería artesanal con gestión de pedidos, inventario, reportes y cierre de caja profesional.

---

## 🚀 Stack Tecnológico

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend:** Firebase Realtime Database
- **Hosting:** Vercel (recomendado)
- **Testing:** Manual (ver `TESTING_MANUAL.md`)

---

## 📋 Requisitos

- Navegador moderno (Chrome, Firefox, Edge)
- Conexión a internet (para Firebase)
- **Para desarrollo local:** Servidor HTTP simple

---

## ⚙️ Configuración Inicial

### 1. Configurar Firebase

1. Copia `js/config.sample.js` a `js/config.js`
2. Reemplaza los valores con tus credenciales de Firebase:

```javascript
const CONFIG = {
    firebase: {
        apiKey: "TU_API_KEY",
        authDomain: "tu-app.firebaseapp.com",
        databaseURL: "https://tu-app-default-rtdb.firebaseio.com/",
        projectId: "tu-proyecto",
        storageBucket: "tu-app.firebasestorage.app",
        messagingSenderId: "123456789",
        appId: "1:123456789:web:abcd1234"
    }
};
```

### 2. Desarrollo Local

**Con Python 3:**

```bash
python -m http.server 8000
```

**Con Node.js (http-server):**

```bash
npx http-server -p 8000
```

Abrir en navegador: `http://localhost:8000`

---

## 🌐 Deployment a Producción (Vercel)

### Paso 1: Instalar Git

1. Descargar Git: <https://git-scm.com/downloads>
2. Instalar con opciones por defecto
3. Reiniciar terminal

### Paso 2: Inicializar Repositorio

```bash
cd "d:\Ore pizzeria APP"
git init
git add .
git commit -m "Initial commit MVP"
```

### Paso 3: Subir a GitHub

1. Crear repo en GitHub: <https://github.com/new>
2. Conectar:

```bash
git remote add origin https://github.com/TU_USUARIO/ore-pizzeria.git
git branch -M main
git push -u origin main
```

### Paso 4: Conectar con Vercel

1. Ir a: <https://vercel.com/>
2. Click "Import Project"
3. Conectar con GitHub
4. Seleccionar repo `ore-pizzeria`
5. **IMPORTANTE:** En "Environment Variables" agregar las credenciales de Firebase (ver js/config.js)
6. Deploy

**URL final:** `https://tu-nombre-proyecto.vercel.app`

---

## 🔐 Usuarios y PINs

| Rol | PIN |
|-----|-----|
| Cajero | `1234` |
| Chef | `0000` |
| Admin | `admin123` |
| Servicio | `1111` |

---

## 📚 Documentación

- [PRD (Requerimientos)](prd.md)
- [Manual de Testing](TESTING_MANUAL.md)
- [Guía de Backups](BACKUPS.md)
- [Estructura del Proyecto](ESTRUCTURA_PROYECTO.md)
- [Evaluación delProyecto](../brain/a32dd59b-1d24-44d2-80e2-c1f5a7a2f314/EVALUACION_PROYECTO.md)

---

## 🛠️ Mantenimiento

### Backups

Ver `BACKUPS.md` para instrucciones detalladas de respaldo.

### Testing

Ejecutar checklist de `TESTING_MANUAL.md` antes de cada deploy.

---

## 📞 Soporte

**Desarrollado por:** Antigravity AI + Safag  
**Versión:** 1.0.0 MVP
**Última actualización:** 2026-01-23

---

## 📝 Licencia

Uso privado - Ore Pizzeria
