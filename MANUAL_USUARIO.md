# 📖 Manual de Usuario - Ore Pizzeria POS

**Guía Completa para Dueño y Empleados**

> Este manual explica paso a paso cómo usar el sistema de punto de venta de Ore Pizzeria. Está diseñado para que cualquier persona pueda aprender a usarlo, incluso sin experiencia previa.

---

## 🔑 1. Acceso al Sistema

### 1.1 Ingreso a la App

1. **Abrir el navegador** (Chrome, Firefox o Edge)
2. **Ir a la dirección web** de la app (ej: `https://ore-pizzeria.vercel.app`)
3. **

Seleccionar tu rol** en el menú desplegable:

- **Cajero**: Para tomar pedidos y cobrar
- **Chef (Cocina)**: Para ver y marcar pedidos listos
- **Administrador**: Para gestionar productos y ver reportes
- **Servicio**: Para registrar ingresos/egresos extras

1. **Ingresar tu PIN** (contraseña numérica)
2. Hacer clic en **INGRESAR**

### 1.2 Credenciales de Acceso

| Rol | PIN | Funciones |
|-----|-----|-----------|
| **Cajero** | `1234` | Ventas, clientes, cierre de caja |
| **Chef** | `0000` | Ver pedidos y marcar listos |
| **Administrador** | `admin123` | Productos, precios, estadísticas |
| **Servicio** | `1111` | Movimientos de dinero (ingresos/egresos) |

> ⚠️ **Importante**: Mantén estos PINs en secreto. Solo compártelos con personal autorizado.

---

## 👨‍💼 2. Manual del Cajero

### 2.1 Apertura de Turno

Al iniciar sesión, el sistema te pedirá abrir el turno. Esto es **obligatorio** antes de comenzar a vender.

1. **Contar el dinero inicial** (billetes y monedas en caja)
2. **Ingresar las cantidades** en la calculadora:
   - **Billetes**: 100.000 Gs, 50.000 Gs, 20.000 Gs
   - **Monedas**: 10.000 Gs, 5.000 Gs, 2.000 Gs, etc.
3. Verificar que el **Total Caja** sea correcto
4. **Ingresar Stock de Masas** (cuántas pizzas puedes hacer)
5. **Ingresar Stock de Bebidas** (cuántas bebidas hay disponibles)
6. Hacer clic en **INICIAR TURNO**

> 💡 **Consejo**: El stock te ayudará a saber cuándo te estás quedando sin productos. El sistema te avisará con colores rojos cuando queden pocas unidades.

---

### 2.2 Tomar un Pedido (Paso a Paso)

#### **PASO 1: Armar la Pizza**

1. Elegir el modo:
   - **Completa**: Un solo sabor en toda la pizza
   - **Mitad y Mitad**: Dos sabores diferentes

2. **Seleccionar sabor(es)** haciendo clic en las tarjetas:
   - Si es **Completa**: Clic en 1 sabor
   - Si es **Mitad y Mitad**: Clic en 2 sabores

3. Los sabores seleccionados se marcan con un **borde dorado**

#### **PASO 2: Agregar Bebidas u Otros**

1. Bajar hasta la sección **"Bebidas / Otros"**
2. Hacer clic en lo que el cliente quiera (Coca Cola, Agua, etc.)

#### **PASO 3: Observaciones Especiales**

Si el cliente tiene alguna petición especial:

1. Escribir en el campo **"Observaciones"**
   - Ejemplos: *"Sin cebolla"*, *"Bien cocida"*, *"Extra queso"*

2. Hacer clic en **AGREGAR AL PEDIDO**

#### **PASO 4: Datos del Cliente**

1. Escribir el nombre del cliente en **"Buscar o escribir cliente..."**
   - Si es cliente frecuente, aparecerá sugerido (hacer clic para seleccionar)
   - Si es nuevo, escribir y hacer clic en el botón **+** para agregarlo
   - Si es ocasional, hacer clic en el icono 👤

#### **PASO 5: Calculadora de Vuelto**

Esta herramienta te ayuda a calcular cuánto debes devolver al cliente:

1. En el campo **"¿Con cuánto paga el cliente?"**, escribir el monto
   - Ejemplo: Si el total es **Gs. 54.000** y paga con **Gs. 60.000**, escribir `60000`

2. El sistema calculará automáticamente el vuelto:
   - **Vuelto a entregar: Gs. 6.000**

> 📝 **Nota**: Esta calculadora es OPCIONAL. Si el cliente paga justo, déjala vacía.

#### **PASO 6: Tipo de Entrega**

Seleccionar dónde comerá el cliente:

- **Para Comer Acá**: Cliente se queda en el local
- **Retiro en Local**: Cliente viene a buscar
- **Delivery**: Se entrega a domicilio

> 💵 Si es **Delivery**, aparecerá un campo para ingresar el costo del envío

#### **PASO 7: Método de Pago**

Seleccionar cómo pagará:

- **Efectivo**
- **Transferencia**
- **A elegir** (si aún no sabe)

#### **PASO 8: Enviar el Pedido**

Tienes dos opciones:

1. **ENVIAR AL CHEF (Pendiente)** 🟠
   - Usar cuando el cliente **NO pagó todavía**
   - El pedido aparecerá en naranja en la cocina

2. **COBRADO Y ENVIAR (Pagado)** 🟢
   - Usar cuando el cliente **YA pagó**
   - El pedido aparecerá en verde en la cocina

---

### 2.3 Ver Pedidos Enviados

1. En el menú superior, hacer clic en **"Enviados"**
2. Verás todos los pedidos recientes con su estado:
   - **LISTO** (verde): Pizza terminada, lista para entregar
   - **completed** (naranja): Pizza en proceso en la cocina

> 🔄 **Auto-limpieza**: Cuando cierres caja, todos los pedidos completados se archivarán automáticamente para mantener la vista limpia al día siguiente.

---

### 2.4 Gestión de Clientes

#### Ver Directorio de Clientes

1. Clic en pestaña **"Clientes"**
2. Usar el buscador para encontrar clientes
3. Opciones disponibles:
   - **SELECCIONAR**: Usa ese cliente para el pedido actual
   - **ELIMINAR**: Borra el cliente del sistema

#### Agregar Cliente Nuevo

1. Hacer clic en el botón **+** (dorado) junto al campo de cliente
2. Escribir el nombre
3. Confirmar

---

### 2.5 Cierre de Caja

Al finalizar el turno, debes cerrar la caja para generar el informe del día.

#### **PASO 1: Solicitar Cierre**

1. Hacer clic en **"CERRAR TURNO / CAJA"** (botón gris abajo)
2. Se abrirá el panel de cierre

#### **PASO 2: Contar Dinero**

1. **Contar billetes y monedas** físicamente
2. **Ingresar las cantidades** en la calculadora
   - El sistema suma automáticamente
3. Verificar el **Total Caja** contado

#### **PASO 3: Revisar Diferencia**

El sistema te mostrará:

- **EFECTIVO ESPERADO**: Lo que debería haber según ventas
- **DIFERENCIA**: Diferencia entre contado y esperado
  - 🟢 Verde: Sobra dinero
  - 🔴 Rojo: Falta dinero
  - ⚪ Blanco: Coincide exacto

#### **PASO 4: Registrar Movimientos (Opcional)**

Si hubo ingresos o egresos extras durante el día:

1. Ir a la pestaña **"Registro Movimientos"**
2. Escribir descripción (Ej: "Compra de insumos")
3. Ingresar monto
4. Seleccionar tipo: **Ingreso** o **Egreso**
5. Clic en **Agregar**

#### **PASO 5: Cerrar**

1. Hacer clic en **Cerrar Caja**
2. El sistema descargará un archivo `.txt` con el informe completo
3. **Los pedidos completados se archivarán automáticamente** ✨

> 📄 **El informe incluye**:
>
> - Ventas por método de pago (Efectivo/Transferencia)
> - Detalle de deliveries
> - Movimientos de caja
> - Productos más vendidos
> - Diferencia de caja

---

## 👨‍🍳 3. Manual del Chef

### 3.1 Interfaz de Cocina

Al ingresar como Chef, verás la **COLA DE PEDIDOS** en tiempo real.

#### Colores de Pedidos

- 🟢 **Verde** (PAGADO): Cliente ya pagó
- 🟠 **Naranja** (PENDIENTE): Cliente no pagó aún
- 🔵 **Línea Punteada Azul**: Pedido para comer en el local

### 3.2 Información en Cada Tarjeta

Cada pedido muestra:

- **#Número - Cliente**: Identificador único
- **Hora**: Cuándo se tomó el pedido
- **Items**: Lista de pizzas y bebidas
  - Sabores (si es mitad y mitad, se indica)
  - Observaciones especiales (SIN cebolla, etc.)
- **Tipo de entrega**: Local / Retiro / Delivery
- **Total**: Monto del pedido
- **Estado de pago**: PAGADO / PENDIENTE

### 3.3 Marcar Pedido como Listo

1. **Terminar la pizza**
2. **Hacer clic en el botón "MARCAR COMO LISTO"** (abajo de la tarjeta)
3. El pedido cambiará de estado a **LISTO**
4. El cajero verá la actualización instantáneamente

> 📱 **Responsive**: La vista funciona perfectamente en:
>
> - **Celular**: 1 columna
> - **Tablet**: 2 columnas
> - **PC**: 3-4 columnas

---

## 🔧 4. Manual del Administrador

### 4.1 Gestión de Productos

#### Agregar Nuevo Producto

1. Ingresar como **Admin**
2. Ir a pestaña **🍕 Productos**
3. Seleccionar categoría:
   - **Pizza (Sabor)**
   - **Bebida / Otro**
4. Completar datos:
   - **Nombre**: Ej. "Napolitana con Jamón"
   - **Precio**: Solo números, ej: `45000`
   - **Foto** (opcional): Clic en "📷 Seleccionar Foto"
5. Clic en **AGREGAR PRODUCTO**

> 💡 El nuevo producto aparecerá automáticamente en la vista del Cajero

---

### 4.2 Estadísticas

#### Ver Dashboard

1. Ir a pestaña **📊 Estadísticas**
2. Verás:
   - **Arqueo del Día**: Efectivo, Transferencias, Total
   - **Pizzas Vendidas**: Con filtro por Hoy/Este Mes/Este Año
   - **Bebidas Vendidas**: Con filtro por período

---

### 4.3 Reportes de Ventas

#### Exportar a Excel

1. Ir a pestaña **📁 Reportes**
2. Seleccionar rango de fechas:
   - **Desde**: Fecha inicial
   - **Hasta**: Fecha final
3. Elegir opción:
   - **EXTRAER (.XLSX)**: Descarga solo los datos
   - **EXTRAER Y LIMPIAR**: Descarga Y borra del sistema (para limpiar base de datos)

> ⚠️ **Precaución**: "Extraer y Limpiar" borra permanentemente los datos. Usar solo cuando tengas demasiados pedidos antiguos.

---

## 💰 5. Manual de Servicio (Movimientos)

### 5.1 ¿Cuándo usar este rol?

Usa **Servicio** para registrar dinero que ENTRA o SALE, pero que NO es una venta:

**Ejemplos de INGRESO** 💚:

- Cliente devuelve dinero prestado
- Venta de algo que no está en el menú
- Aporte del dueño

**Ejemplos de EGRESO** ❌:

- Compra de ingredientes
- Pago de servicios (luz, agua)
- Propinas para repartidores

---

### 5.2 Registrar Movimiento

1. Ingresar como **Servicio** (PIN: 1111)
2. Elegir tipo:
   - **💰 INGRESO** (botón verde)
   - **💸 EGRESO** (botón rojo)
3. Completar datos:
   - **Monto**: Cantidad en Guaraníes
   - **Descripción**: Explicar el motivo (OBLIGATORIO)
4. Clic en **GUARDAR**

> 📝 Estos movimientos aparecerán en el informe de cierre de caja del Cajero.

---

## ❓ 6. Preguntas Frecuentes

### ¿Qué pasa si me equivoco al tomar un pedido?

**Antes de enviarlo**:

- Hacer clic en la **X** roja del producto en el carrito para eliminarlo

**Después de enviarlo**:

- No se puede eliminar. Contactar al Administrador.

---

### ¿Por qué no veo algunos pedidos en "Enviados"?

- Los pedidos completados (LISTO + PAGADO) se archivan automáticamente al **cerrar caja**.
- Esto mantiene la lista limpia cada día.

---

### ¿Qué hago si el sistema dice "Stock bajo"?

1. Avisar al encargado de cocina
2. Preparar más masas o reabastecer bebidas
3. El Admin puede ajustar el stock manualmente si es necesario

---

### ¿Para qué sirve el campo "Paga con..."?

Es una **calculadora de vuelto automática**:

- **Ejemplo 1**:
  - Total: Gs. 54.000
  - Cliente paga con: Gs. 100.000
  - → Vuelto: **Gs. 46.000** (calculado automáticamente)

- **Si el cliente paga justo**: Dejar el campo vacío

---

### ¿Puedo usar la app desde mi celular?

**¡Sí!** La app está optimizada para:

- 📱 Celulares
- 📱 Tablets
- 💻 Computadoras

Solo necesitas conexión a internet.

---

## 🆘 7. Solución de Problemas

### El sistema no carga / se queda en blanco

1. **Verificar conexión a internet**
2. **Recargar la página** (F5 o Ctrl+R)
3. **Borrar caché del navegador**

---

### "Error 400: Operation not allowed"

- Problema de configuración de Firebase
- Contactar al desarrollador

---

### Los pedidos no llegan a la cocina

1. Verificar que el Chef esté logueado
2. Recargar la página en la vista del Chef
3. Verificar conexión a internet

---

### No puedo cerrar caja

- Asegúrate de haber **contado el dinero** (ingresar al menos un billete/moneda)
- Si el problema persiste, anota manualmente el cierre y contacta soporte

---

## 📞 8. Soporte Técnico

**Desarrollador**: Antigravity AI + Safag  
**Versión**: 2.0 (Actualizado: Enero 2026)

> Para problemas técnicos, guardar capturas de pantalla del error y contactar al desarrollador.

---

## ✅ 9. Checklist Rápido de Entrenamiento

### Para Cajeros

- [ ] Sé abrir turno contando dinero
- [ ] Puedo armar una pizza completa
- [ ] Puedo armar una mitad y mitad
- [ ] Sé agregar bebidas
- [ ] Entiendo la calculadora de vuelto
- [ ] Puedo cerrar caja y generar informe

### Para Chefs

- [ ] Entiendo los colores de pedidos
- [ ] Puedo marcar pedidos como LISTO
- [ ] Sé leer observaciones especiales
- [ ] Puedo usar la app en celular/tablet

### Para Administradores

- [ ] Puedo agregar nuevos productos
- [ ] Sé ver estadísticas
- [ ] Puedo exportar reportes

---

**📚 Fin del Manual - ¡Éxito con las ventas! 🍕**
