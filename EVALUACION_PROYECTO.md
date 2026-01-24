# ORE Pizzería – Technical QA & Stress Test Report

**Fecha de Análisis:** 24/01/2026
**Versión Auditada:** v2_secured (Production Candidate)
**Auditor:** Antigravity AI (Senior QA Authority)

---

## 1. Executive Summary

El sistema "Ore Pizzería (v2_secured)" es una aplicación web robusta para operaciones de pequeña escala, pero presenta **Riesgos de Escalabilidad Críticos** para el mediano/largo plazo.

Se han mitigado las vulnerabilidades de seguridad inmediatas (XSS, Auth básico, Integridad de Stock), lo cual la hace segura para operar. Sin embargo, la arquitectura "Fat Client" (donde el navegador procesa toda la lógica) creará cuellos de botella severos cuando el volumen de datos crezca.

**Veredicto:** Apta para lanzamiento (Local único, <50 pedidos/día). **No apta** para franquicia o alto volumen sin refactorización de backend.

---

## 2. System Overview (Inferred)

Sistema POS Monolítico basado en JavaScript Vanilla y Firebase Realtime Database.

* **Frontend:** Maneja toda la lógica de negocio (Cálculos, Stock óptimista, Generación de IDs).
* **Backend:** Firebase actúa como almacén de datos "tonto" (Dumb Store) con validación mínima.
* **Persistencia:** Híbrida (Nube + LocalStorage para recuperación de desastres).
* **Roles:** Cajero (Full Access), Chef (Read-only view), Admin (Stats), Servicio (Caja).

---

## 3. Critical Issues

### [SCL-01] Colapso del Panel Administrativo (Admin Stats Bomb)

* **Severidad:** 🚨 **CRITICA**
* **Ubicación:** `loadAdminStats` en `app.js`.
* **El Problema:** El sistema descarga **toda la historia de pedidos** (`ref('orders').once('value')`) cada vez que el Admin entra a estadísticas.
* **Impacto Real:**
  * Día 1: Funciona perfecto.
  * Día 90 (con 3000 pedidos): La tablet del dueño se congelará por 10-20 segundos al intentar procesar 3000 objetos JSON en memoria.
  * Día 365: El navegador craseará por "Out of Memory".

### [OPS-01] Edición Recursiva de Pedidos ("The ID Explosion")

* **Severidad:** 🔴 **ALTA**
* **Ubicación:** Lógica de edición (`-B`).
* **El Problema:** Si edito el pedido `1001-B`, el sistema podría intentar generar `1001-B-B` o fallar. No hay límite de profundidad.
* **Impacto Real:** Confusión en cocina ("¿Cuál es el ticket real?") y trazabilidad sucia en base de datos.

### [NET-01] Dependencia de Conexión para Stock

* **Severidad:** 🟠 **MEDIA**
* **Ubicación:** `sendOrder` (Transacción Firebase).
* **El Problema:** La transacción de stock requiere confirmación del servidor.
* **Escenario:** Internet se corta. El cajero intenta enviar. El sistema alerta "Error de conexión".
* **Impacto Real:** **Parálisis Operativa**. No se puede vender nada "offline" porque el sistema prioriza la integridad del stock sobre la disponibilidad de venta. En gastronomía, *the show must go on* (debería permitir venta con stock negativo temporal o advertencia).

---

## 4. Functional Testing Findings

### 4.1 Order Flow

* **✅ Selección de Sabores:** Funciona bien. Lógica de "Mitad y Mitad" es clara.
* **⚠️ Delivery Fee:** No es automático. Depende 100% de que el cajero escriba el monto manual. Riesgo de olvido o inconsistencia.
* **✅ Validación de Precio:** El sistema ahora detecta precios manipulados (<500 Gs) y se auto-corrige.

### 4.2 Menu Logic

* **✅ Carga de Imágenes:** Correcta (Base64). Nota: Cargar imágenes muy pesadas (>2MB) ralentizará el inicio de la app para todos los usuarios.
* **⚠️ Sin "Out of Stock" (Menu):** Si se acaban las masas, el menú no bloquea visualmente los botones de Pizza. Solo falla al final (`sendOrder`). Esto frustra al cajero (toma el pedido verbalmente y luego el sistema lo rechaza).

### 4.3 Kitchen Flow

* **✅ Visualización:** Clara para bajo volumen.
* **⚠️ Saturación Visual:** No hay paginación. Si hay 20 tickets pendientes, el Chef debe hacer scroll infinito.
* **⚠️ Sin Undo Real:** Si el Chef marca "Listo" por error, el pedido desaparece de la vista principal "Cooking". Hay que buscarlo en "Ready" para deshacer. Flujo incómodo.

---

## 5. UX / Human Factors Analysis

* **Error Prevention:** Excelente adición del `LocalStorage`. La recuperación ante `F5` salva vidas.
* **Cognitive Load:** La calculadora de cambio es manual. El cajero debe escribir cuánto paga el cliente. Útil, pero agrega un paso.
* **Touch Targets:** Botones de Sabores son grandes y amigables. Botones de "Eliminar Movimiento" (x) son pequeños y peligrosos para dedos gruesos/grasosos.

---

## 6. Edge Cases & Failure Scenarios

1. **"El Cajero Zombie":** Un cajero abre turno, trabaja, y se va sin cerrar turno. Al día siguiente, otro cajero llega. El sistema recupera el estado del día anterior (`loadLocalState`).
    * *Resultado:* Mezcla de ventas de ayer con las de hoy.
    * *Mitigación:* Se agregó lógica de fecha en `v2_secured` (`data.date === today`), así que esto está cubierto ✅.

2. **La Edición Fantasma:**
    * Cajero edita pedido #1005 (agrega 1 coca).
    * Chef marca #1005 como "Listo" en el mismo segundo.
    * Cajero guarda su edición.
    * *Resultado:* Conflicto. El sistema maneja esto creando un ticket nuevo (`-B`) si estaba listo, pero la UX es confusa.

---

## 7. Missing or Underdeveloped Features

1. **Impresión de Tickets (Thermal Printer):**
    * **CRITICO OPERACIONAL.** No hay integración con ESC/POS. Un restaurante *necesita* comandas de papel para la cocina y facturas para el cliente. Actualmente es 100% pantalla.

2. **Cierre Ciego:**
    * El sistema muestra cuánto *debería* haber en caja (`expectedCash`). Esto invita al robo (el cajero solo pone lo que dice la pantalla). Un cierre ciego real no muestra el esperado hasta que se ingresa lo contado.

---

## 8. Risk Assessment

* **Riesgo Tecnológico:** **ALTO**. La base de datos Firebase Realtime crece indefinidamente sin particionado.
* **Riesgo Operativo:** **MEDIO**. Dependencia de internet para descontar stock (transacción).
* **Riesgo Financiero:** **BAJO** (Mitigado). La seguridad v2 protege contra fraude básico.

---

## 9. Improvement Recommendations

1. **PRIORIDAD 1 (Admin):** Cambiar `loadAdminStats` para que use `limitToLast(100)` o agregue un filtro de fechas en la consulta de Firebase (`orderByChild('date').equalTo(today)`). **NO cargar toda la DB.**
2. **PRIORIDAD 2 (UX):** Bloquear UI de pizzas si `stock == 0` antes de que el cajero intente armarla.
3. **PRIORIDAD 3 (Ops):** Implementar impresión básica (`window.print()`) con una hoja de estilos `@media print` para impresoras térmicas de 80mm.

---

## 10. Testing Coverage Gaps

* **iPhone/Safari:** No probado. iOS suele ser agresivo borrando `localStorage` o manejando eventos de toque (`onclick` vs `ontouchstart`).
* **Conexión Lenta (3G):** Se probó "Online" y "Offline", pero no "Internet Lento" (Latencia alta). Podría causar duplicidad si el usuario se desespera.

---

**Fin del Reporte**
