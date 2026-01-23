# 🗄️ Guía de Backups - Firebase Realtime Database

## ⚠️ Importancia

Firebase NO hace backups automáticos en el plan gratuito. **Debes hacer backups manualmente**.

---

## 📅 Frecuencia Recomendada

- **Diario:** Si hay movimiento de ventas
- **Semanal:** Si el uso es ligero
- **Antes de cada actualización** del código

---

## 🛠️ Método 1: Backup Manual desde Firebase Console

### Pasos

1. Ir a [Firebase Console](https://console.firebase.google.com/)
2. Seleccionar proyecto: `ore-pizza`
3. Menú lateral → **Realtime Database**
4. Click en los 3 puntos (⋮) → **Export JSON**
5. Guardar archivo como: `backup_YYYY-MM-DD.json` (ej: `backup_2026-01-23.json`)
6. **Almacenar en carpeta segura** (Google Drive, Dropbox, etc.)

---

## 🔧 Método 2: Backup Automático con Script Node.js

### Paso 1: Instalar Node.js

1. Descargar desde: <https://nodejs.org/>
2. Instalar versión LTS

### Paso 2: Crear Script de Backup

Crea un archivo: `scripts/backup-firebase.js`

```javascript
const admin = require('firebase-admin');
const fs = require('fs');

// Inicializar Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://ore-pizza-default-rtdb.firebaseio.com/'
});

// Exportar datos
const db = admin.database();
db.ref('/').once('value', (snapshot) => {
  const data = snapshot.val();
  const date = new Date().toISOString().split('T')[0];
  const filename = `backups/backup_${date}.json`;

  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
  console.log(`✅ Backup guardado: ${filename}`);
  process.exit();
});
```

### Paso 3: Obtener Service Account Key

1. Firebase Console → Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Guardar como `scripts/serviceAccountKey.json` (**NO compartir**)

### Paso 4: Instalar Dependencias

```bash
cd scripts
npm install firebase-admin
```

### Paso 5: Ejecutar Backup

```bash
node scripts/backup-firebase.js
```

---

## 🔁 Restaurar desde Backup

### Método Simple (Manual)

1. Firebase Console → Realtime Database
2. Click en los 3 puntos (⋮) → **Import JSON**
3. Seleccionar archivo `backup_YYYY-MM-DD.json`
4. **⚠️ ADVERTENCIA:** Esto sobrescribe TODO. Confirmar antes.

---

## 📂 Organización de Backups

```
Ore Pizzeria/
├── backups/
│   ├── 2026-01/
│   │   ├── backup_2026-01-23.json
│   │   ├── backup_2026-01-24.json
│   ├── 2026-02/
│       ├── backup_2026-02-01.json
```

---

## 🔐 Mejores Prácticas

1. **Nunca** confíes en un solo lugar. Backup en:
   - Google Drive
   - Disco externo
   - Otro servicio en la nube

2. **Prueba la restauración** una vez al mes para asegurarte de que funcionan.

3. **Rotación:** Mantén backups de los últimos 30 días, borra los más antiguos.

---

## ⏰ Automatización con Cron (Avanzado)

Para ejecutar backups automáticos cada día a las 11 PM:

**Windows (Task Scheduler):**

- Abrir "Programador de tareas"
- Crear tarea básica
- Acción: `node D:\Ore pizzeria APP\scripts\backup-firebase.js`
- Frecuencia: Diaria a las 23:00

**Linux/Mac (Crontab):**

```bash
0 23 * * * cd /path/to/project && node scripts/backup-firebase.js
```

---

## 🚨 Plan de Contingencia

**Si pierdes todos los datos:**

1. NO PÁNICO
2. Ir a carpeta de backups
3. Elegir el más reciente
4. Restaurar desde Firebase Console
5. Verificar que todo funciona
6. Continuar operaciones

---

**💡 Recuerda:** Un backup que nunca pruebas es como no tener backup.
