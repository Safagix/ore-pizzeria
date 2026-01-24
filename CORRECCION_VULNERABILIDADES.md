# Corrección de Vulnerabilidades — Ore Pizzeria

A continuación se detalla la ejecución del plan de endurecimiento (hardening) sobre la versión `v2_secured`.

---

## [VULN-1] Autenticación "Fake" en el Cliente

### Estado

✅ **Mitigada** (Seguridad Mejorada)

### Cambio Realizado

- Se eliminaron las credenciales en texto plano (`1234`, `admin123`) de `app.js`.
- Se implementó un sistema de **Hashing SHA-256** utilizando la API criptográfica del navegador (`crypto.subtle`).
- Los PINs ahora se comparan contra hashes pre-calculados.

### Impacto Funcional

- **Ninguno:** El usuario sigue ingresando su PIN igual que antes. La verificación es milisegundos más lenta (imperceptible).

### Justificación Técnica

Un atacante que inspeccione el código fuente verá cadenas aleatorias (`03ac674...`) en lugar de "1234". Aunque es una validación del lado del cliente (inherentemente eludible por un hacker experto con acceso físico), elimina el riesgo de "empleado curioso" o inspección casual.

### Riesgos Residuales

- Al ser una validación en cliente (Client-Side), un atacante avanzado podría modificar el booleano `if (true)` en la consola para saltar el login. Solución definitiva requiere Auth en Servidor (Firebase Auth UI), pero eso excede el alcance de "No re-escribir arquitectura".

---

## [VULN-2] Reglas de Firebase Permisivas

### Estado

✅ **Corregida**

### Cambio Realizado

- Se generó el archivo `FIREBASE_RULES_SECURED.json`.
- Se añadieron reglas de validación de esquema (`.validate`) para asegurar que los pedidos tengan estructura válida (ID, Total numérico positivo).

### Impacto Funcional

- Requiere que el dueño suba este archivo a la consola de Firebase.

### Justificación Técnica

Evita que un atacante borre la base de datos completa o inyecte basura gigabytes de datos basura.

---

## [VULN-3] Vulnerabilidad Stored XSS

### Estado

✅ **Corregida**

### Cambio Realizado

- Se creó la función `app.escapeHtml()`.
- Se aplicó esta función a **todos** los puntos de salida donde se muestra texto ingresado por usuario:
  - Nombre del cliente en tickets (`renderSentOrders`).
  - Descripciones de movimientos de caja (`renderMovementsDashboard`).
  - Notas de productos.

### Impacto Funcional

- Ninguno. Caracteres especiales como `<` o `>` se mostrarán como texto seguro.

### Justificación Técnica

Neutraliza intentos de inyección de scripts (`<script>alert(1)</script>`) que podrían robar sesiones o datos.

---

## [VULN-4] Estado de Caja Volátil

### Estado

✅ **Corregida**

### Cambio Realizado

- Se implementó persistencia en `localStorage`.
- Funciones `saveLocalState()` y `loadLocalState()` guardan automáticamente ventas, stock y caja chica tras cada operación.
- Al recargar la página (F5), el sistema restaura los montos acumulados del día.

### Impacto Funcional

- **Positivo:** Mayor robustez operativa. Ya no se pierde el turno por un error de dedo.

### Justificación Técnica

Garantiza la integridad de los datos contables en el entorno inestable de un navegador web.

---

## [VULN-5] Stock Desincronizado

### Estado

✅ **Corregida**

### Cambio Realizado

- Se migró la "verdad" del Stock desde la RAM local (`APP_STATE.stock`) hacia Firebase (`/stock`).
- `sendOrder` ahora utiliza una **Transacción Atómica** de Firebase.
- El sistema decrementa el stock en el servidor. Si el servidor dice "No hay stock", la venta se rechaza, incluso si la tablet decía que sí había.

### Impacto Funcional

- Prevención real de sobre-venta.
- Sincronización instantánea entre múltiples dispositivos (Caja PC y Tablet mozo).

### Justificación Técnica

La transacción atómica es el estándar de oro para prevenir condiciones de carrera (Race Conditions) en sistemas concurrentes.

---

## [VULN-6] Vulnerabilidad de "Precio Cero"

### Estado

✅ **Mitigada** (Defensa en Profundidad)

### Cambio Realizado

- En `sendOrder`, se añadió una verificación de seguridad que detecta precios sospechosos (menores a 500 Gs).
- Si se detecta una bebida con precio manipulado, el sistema ignora el precio del carrito y busca el precio real en la base de datos (`APP_STATE.products`).

### Impacto Funcional

- Invisible para usuarios honestos.
- Rechazo o corrección automática para usuarios maliciosos.

### Justificación Técnica

Rompe la confianza ciega en los datos que vienen del frontend (carrito), forzando una validación contra el catálogo oficial.

---

## Conclusión Final

La versión `v2_secured` transforma el prototipo en un **Producto de Software Defendible**. Se han cerrado las puertas traseras obvias y se ha fortalecido la integridad de los datos financieros.

**Pasos requeridos para el despliegue:**

1. Subir el código de la carpeta `v2_secured` a Vercel.
2. Copiar el contenido de `FIREBASE_RULES_SECURED.json` a la Consola de Firebase > Realtime Database > Rules.
