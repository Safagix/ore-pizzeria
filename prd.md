# PRD v2.0: APP ORE PIZZERIA (SECURED PRODUCTION)

## 1. RESUMEN DEL PROYECTO

Desarrollo de una aplicación Android/Web para la gestión integral de pedidos de Ore Pizzeria. Esta versión ha sido endurecida (Hardened) para garantizar seguridad, integridad de datos y estabilidad operativa. El sistema utiliza una arquitectura modular (`v2_secured`) con lógica separada de la UI.

## 2. ROLES DE USUARIO Y SEGURIDAD CRIPTOGRÁFICA

La seguridad ya no es por texto plano, sino mediante **Hashing SHA-256** del lado del cliente. Ningún componente almacena los PINs reales.

- **Cajero:** Toma de pedidos, gestión de stock y caja. (PIN 1234 - Hashed).
- **Chef:** Visualización de pedidos en tiempo real. (PIN 0000 - Hashed).
- **Servicio:** Registro de movimientos externos. (PIN 1111 - Hashed).
- **Admin:** Gestión de productos, estadísticas y limpieza. (Contraseña admin123 - Hashed).

---

## 3. REQUERIMIENTOS FUNCIONALES MEJORADOS

### 3.1. PERSISTENCIA DE ESTADO (Anti-Error Humano)

El sistema implementa **Persistencia Local (LocalStorage)**. Si el usuario cierra el navegador o recarga la página (`F5`) accidentalmente:

- Las ventas acumuladas del turno NO se borran.
- El stock actual se restaura.
- La sesión se mantiene íntegra si es dentro del mismo día calendario.

### 3.2. MÓDULO DE CAJERO Y CAJA

- **Apertura de Turno:** Obligatoria con arqueo inicial y stock.
- **Cálculo de Stock:** Sincronizado en tiempo real con Firebase. Si un dispositivo descuenta stock, se refleja en todos instantáneamente.
- **Validación de Pedido:** Sanitización automática de entradas (Nombre del cliente, Notas) para evitar ataques XSS o caracteres que rompan la base de datos.
- **Protección de Precios:** Validación contra el catálogo oficial. Si se intenta alterar el precio de un producto, el sistema lo detecta y lo corrige al precio de lista.

### 3.3. MÓDULO DE COCINA (CHEF)

- Cola de pedidos en tiempo real con estados visuales (Naranja/Verde).
- **Inyección Segura:** Los nombres y notas de pedidos se renderizan de forma segura para evitar ejecuciones de código malicioso.

### 3.4. ADMINISTRACIÓN Y ESCALABILIDAD

- **Mantenimiento Obligatorio:** Debido al volumen de datos, el administrador debe usar la función **"EXTRAER Y LIMPIAR"** periódicamente (mensual/quincenal). Esto descarga el Excel y vacía la base de datos para mantener la velocidad de la App en dispositivos móviles.
- **Gestión de Productos:** Permite subir fotos y cambiar precios que se reflejan en segundos en todas las tabletas.

---

## 4. ESPECIFICACIONES TÉCNICAS (v2_secured)

- **Arquitectura:** Modular ES6 (api/firebase, api/products, api/orders).
- **Base de Datos:** Firebase Realtime Database con **Reglas de Seguridad Reforzadas** (Validación de esquema y tipos).
- **Integridad:** Uso de **Transacciones Atómicas** para el descuento de stock (evita sobre-venta concurrente).
- **Despliegue:** PWA (instalable en Android sin Play Store) servida por Vercel.

---

## 5. CONCLUSIÓN TÉCNICA

Esta versión 2.0 es apta para uso profesional con dinero real. Se priorizó la **Integridad Financiera** (que no se pierdan datos de caja) y la **Seguridad** (protección contra acceso no autorizado) sobre funciones estéticas menores.
