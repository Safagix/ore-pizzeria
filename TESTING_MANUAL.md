# 🧪 Manual de Testing - Ore Pizzeria MVP

## Propósito

Este documento guía las pruebas manuales necesarias antes de llevar la aplicación a producción.

---

## ✅ Checklist de Testing

### 🔐 1. Autenticación y Roles

- [ ] **T001: Login Cajero**
  - Seleccionar rol "Cajero"
  - Ingresar PIN: `1234`
  - **Esperado:** Acceso a vista de cajero con tabs (Nuevo Pedido, Enviados, Clientes, Historial)

- [ ] **T002: Login Chef**
  - Seleccionar rol "Cocina (Chef)"
  - Ingresar PIN: `0000`
  - **Esperado:** Vista de cocina con comandas en tiempo real

- [ ] **T003: Login Admin**
  - Seleccionar rol "Administrador"
  - Ingresar PIN: `admin123`
  - **Esperado:** Panel con tabs (Productos, Estadísticas, Reportes)

- [ ] **T004: Login Servicio**
  - Seleccionar rol "SERVICIO (Movimientos)"
  - Ingresar PIN: `1111`
  - **Esperado:** Botones de Ingreso/Egreso visibles

- [ ] **T005: PIN Incorrecto**
  - Intentar login con PIN incorrecto
  - **Esperado:** Mensaje de error

---

### 🍕 2. Flujo de Pedido Completo (Cajero)

- [ ] **T006: Apertura de Turno**
  - Login como cajero
  - Ingresar stock de masas: `50`
  - Ingresar stock de bebidas: `30`
  - Presionar "INICIAR TURNO"
  - **Esperado:** Stock visible en header, modal de apertura cerrado

- [ ] **T007: Crear Pedido Pizza Completa**
  - Seleccionar cliente "Ocasional"
  - Modo: "Completa"
  - Sabor: Muzzarella
  - Agregar pizza
  - **Esperado:** Pizza en carrito con precio correcto

- [ ] **T008: Crear Pedido Mitad y Mitad**
  - Cambiar a modo "Mitad y Mitad"
  - Sabor 1: Napolitana
  - Sabor 2: Pepperoni
  - Agregar pizza
  - **Esperado:** Pizza con ambos sabores en carrito

- [ ] **T009: Agregar Observaciones**
  - En pizza del carrito, ingresar observación: "Sin cebolla"
  - **Esperado:** Observación guardada y visible

- [ ] **T010: Agregar Bebidas**
  - Seleccionar "Coca Cola 1.5L"
  - Cantidad: 2
  - **Esperado:** Bebidas en carrito

- [ ] **T011: Checkout con Efectivo**
  - Método de pago: Efectivo
  - Total: Ej: 50000 Gs
  - "Paga con": 100000
  - **Esperado:** Vuelto calculado (50000)
  - Presionar "Enviar al Chef" o "Cobrado"

- [ ] **T012: Checkout con Transferencia**
  - Repetir pedido con método "Transferencia"
  - **Esperado:** No solicita "Paga con" ni muestra vuelto

- [ ] **T013: Pedido Delivery**
  - Tipo de consumo: Delivery
  - Monto servicio: 5000
  - **Esperado:** Campo de delivery visible, total actualizado

---

### 👥 3. Gestión de Clientes

- [ ] **T014: Buscar Cliente Existente**
  - Tab "Clientes"
  - Buscar en barra de búsqueda
  - **Esperado:** Resultados filtrados

- [ ] **T015: Agregar Nuevo Cliente**
  - En selector de cliente, elegir "Añadir Nuevo"
  - Nombre: "Juan Pérez"
  - Tel: "0981123456"
  - Dir: "Av. España 123"
  - **Esperado:** Cliente guardado y seleccionable

---

### 📋 4. Gestión de Pedidos Enviados

- [ ] **T016: Editar Pedido No Pagado**
  - Tab "Enviados"
  - Seleccionar pedido con estado "No Pagado"
  - Presionar "Editar"
  - Agregar nueva pizza
  - **Esperado:** Pedido modificado correctamente

- [ ] **T017: Marcar Pedido como Listo (Chef)**
  - Login como Chef
  - Ver pedido en cola
  - Presionar "Listo"
  - **Esperado:** Pedido marcado como terminado

---

### 💰 5. Cierre de Caja (Arqueo)

- [ ] **T018: Abrir Dashboard Arqueo**
  - Como cajero, presionar botón de Arqueo
  - **Esperado:** Dashboard con calculadora de billetes y lista de movimientos

- [ ] **T019: Registrar Movimiento**
  - En "Registro Movimientos"
  - Tipo: Ingreso
  - Monto: 10000
  - Descripción: "Venta panadería"
  - **Esperado:** Movimiento agregado a la lista

- [ ] **T020: Eliminar Movimiento**
  - Presionar "×" en movimiento recién agregado
  - Confirmar
  - **Esperado:** Movimiento eliminado, saldo recalculado

- [ ] **T021: Contar Billetes**
  - Ingresar cantidad de billetes:
    - 100.000: 3 (Total: 300.000)
    - 50.000: 2 (Total: 100.000)
  - **Esperado:** Total contado actualizado

- [ ] **T022: Verificar Diferencia**
  - Ver sección "DIFERENCIA"
  - **Esperado:** Cálculo correcto (Contado - Esperado)

- [ ] **T023: Cerrar Caja**
  - Presionar "Cerrar Caja"
  - **Esperado:** Informe descargado (.txt), app reiniciada

---

### 📊 6. Panel Admin

- [ ] **T024: Ver Estadísticas**
  - Login como Admin
  - Tab "Estadísticas"
  - **Esperado:** Arqueo del día y contadores de pizzas/bebidas visibles

- [ ] **T025: Extraer Reporte Excel**
  - Tab "Reportes"
  - Seleccionar fechas (Desde - Hasta)
  - Presionar "EXTRAER Y LIMPIAR"
  - **Esperado:** Archivo Excel descargado

---

## 🐛 Registro de Bugs

Durante el testing, documentar cualquier bug encontrado:

### Bug #001

- **Descripción:**
- **Pasos para reproducir:**
- **Severidad:** (Crítico / Alto / Medio / Bajo)
- **Estado:** (Pendiente / En progreso / Resuelto)

---

## 📝 Resultado Final

**Fecha de Testing:** _______________  
**Ejecutado por:** _______________  
**Tests Pasados:** ____ / 25  
**Tests Fallidos:** ____  

**¿Listo para Producción?** ☐ SÍ ☐ NO

**Notas:**
