# Informe de Vulnerabilidades — Ore Pizzeria

## Resumen Ejecutivo

El sistema presenta un **Riesgo Crítico** para la operación comercial. Aunque la interfaz es funcional y estética, la arquitectura subyacente de "Seguridad por Oscuridad" y la gestión de estado local hacen que el sistema sea extremadamente frágil.

Se ha detectado que:

1. **Cualquier usuario pudes ser Administrador** en segundos inspeccionando el código.
2. **El stock no está sincronizado** entre dispositivos.
3. Existe riesgo de **Pérdida de Dinero** al cerrar caja si la página se recarga.
4. La base de datos está **efectivamente pública** para lectura y escritura masiva.

No se recomienda el despliegue a producción sin mitigar al menos los fallos de Nivel Crítico.

## Metodología de Análisis

El análisis se realizó mediante revisión estática de código (`White Box Testing`) simulando un atacante con acceso al navegador (F12 Tools) y analizando el flujo de datos lógico en escenarios de estrés (múltiples cajeros, fallos de red).

---

## Vulnerabilidades Detectadas

### 1. Autenticación "Fake" en el Cliente (Hardcoded Credentials)

* **Categoría:** Seguridad
* **Nivel:** 🚨 **CRÍTICO**
* **Descripción:** Los PINs de acceso (`1234`, `admin123`, etc.) están escritos en texto plano dentro de `js/app.js` (Función `login`).
* **Manifestación:** Un empleado descontento o un cliente curioso puede presionar F12, buscar "admin" en el código y encontrar el PIN maestro.
* **Peligro Real:** Robo de recaudación (borrado de movimientos), sabotaje de menú, acceso a reportes financieros.

### 2. Reglas de Firebase Permisivas (Seguridad Teatral)

* **Categoría:** Seguridad / Datos
* **Nivel:** 🚨 **CRÍTICO**
* **Descripción:** La regla `auth != null` combinada con `signInAnonymously()` en el código otorga permisos de lectura/escritura **totales** a cualquier persona que cargue la página.
* **Manifestación:** Un script externo puede conectarse a tu base de datos y ejecutar `firebase.database().ref('/').remove()` borrando todo.
* **Peligro Real:** Pérdida total e irrecuperable de la base de datos por ataque malintencionado.

### 3. Vulnerabilidad Stored XSS (Cross-Site Scripting)

* **Categoría:** Seguridad Web
* **Nivel:** 🔴 ALTO
* **Descripción:** En `renderMovementsDashboard` y `sent-orders-list`, se inyectan variables (`m.desc`, `customerName`) directamente en el DOM usando `innerHTML`.
* **Manifestación:** Si un atacante ingresa como nombre de cliente `<img src=x onerror=alert('Hacked')>`, ese código se ejecutará en el navegador del Cajero y del Admin.
* **Peligro Real:** Robo de sesión, redirección a sitios phishing, exfiltración de datos silenciosa.

### 4. Estado de Caja Volátil (Pérdida de Datos al Recargar)

* **Categoría:** Integridad de Datos / Operación
* **Nivel:** 🔴 ALTO
* **Descripción:** La variable `shiftSales` (ventas del turno) se almacena en memoria RAM (`APP_STATE`). No se guarda en Firebase ni en LocalStorage progresivamente.
* **Manifestación:** Si el cajero presiona F5 (recargar) a mitad del turno, el contador de ventas vuelve a 0.
* **Peligro Real:** El "Cierre de Caja" al final del día reportará faltante de dinero masivo porque el sistema "olvidó" las ventas anteriores al refresh. Descuadres financieros diarios.

### 5. Stock Desincronizado (Isla de Datos)

* **Categoría:** Lógica de Negocio
* **Nivel:** 🟠 MEDIO
* **Descripción:** El stock se gestiona en `APP_STATE.stock` de cada dispositivo.
* **Manifestación:**
  * Tablet A tiene 20 pizzas. Vende 5 (Le quedan 15).
  * PC B tiene 20 pizzas (Le quedan 20).
  * No se comunican entre sí.
* **Peligro Real:** Venta de productos sin stock real. Caos en cocina.

### 6. Vulnerabilidad de "Precio Cero" (Manipulación de Pedido)

* **Categoría:** Seguridad / E-commerce
* **Nivel:** 🟠 MEDIO
* **Descripción:** El precio se envía desde el cliente en el objeto `newOrder`. No hay validación en servidor (Cloud Functions) que verifique si el precio coincide con la carta.
* **Manifestación:** Un usuario técnico puede interceptar el envío o usar la consola para enviar una pizza con `price: 1`.
* **Peligro Real:** Fraude en pedidos (Pagar 1 guaraní por una pizza de 50.000).

---

## Riesgos Emergentes

* **Pánico Operativo:** Si falla internet al momento de enviar un pedido (`sendOrder`), el sistema muestra un `alert` pero mantiene el carrito. Un cajero nervioso podría presionar "Enviar" 5 veces, creando 5 pedidos idénticos y cobrando 5 veces, arruinando la contabilidad.
* **Colisión de IDs:** Si dos dispositivos intentan crear un pedido en el mismo milisegundo, la transacción de `getNextId` podría fallar o generar duplicados si la red es lenta, causando que un pedido sobrescriba a otro.

## Suposiciones Peligrosas

1. *"El usuario nunca recargará la página durante el turno."* (Falso: Es lo primero que hacen cuando algo falla).
2. *"Nadie sabe mirar el código fuente."* (Falso: La seguridad por oscuridad no existe en web).
3. *"Solo usaremos un dispositivo."* (Falso: Si escala, usarán varios y el stock fallará).

## Conclusión Técnica

El sistema está en un estado de **Prototipo Funcional Inseguro**. Cumple con el "Camino Feliz" (Happy Path), pero colapsa ante errores operativos comunes o intentos de ataque básicos.

**NO SE RECOMIENDA OPERAR CON DINERO REAL HASTA RESOLVER (MINIMAMENTE):**

1. Persistencia local de la caja (LocalStorage).
2. Reglas de seguridad reales en Firebase (validación de estructura).
3. Sanitización de inputs (evitar HTML injection).
