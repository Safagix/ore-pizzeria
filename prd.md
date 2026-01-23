PRD: APP ORE PIZZERIA (PARA ANDROID)

1. RESUMEN DEL PROYECTO
Desarrollo de una aplicación Android para la gestión integral de pedidos de Ore Pizzeria. El sistema utiliza como "esqueleto" y base de código el archivo ore.html, aprovechando su lógica de conexión a Firebase y estructura actual. El objetivo es permitir el flujo de pedidos entre cajero y cocina, control de stock y reportes administrativos.

2. ROLES DE USUARIO Y PERMISOS

ROL: CAJERO

- Dispositivo: Tablet.
- Funciones: Toma de pedidos, registro de nuevo cliente, gestión de stock de masas y bebidas, control de caja chica, edición de pedidos enviados, registro de movimientos de ingreso/egreso ajenos a la pizzería, anulación y/o modificación de venta.
- Seguridad: PIN de acceso `1234`.

ROL: CHEF (COCINA)

- Dispositivo: Pantalla/Tablet.
- Funciones: Visualización de fila de pedidos en tiempo real, indicador de estado de pago, indicador de consumición en local, marcar pedidos como listos / modificación de estado del pedido.
- Seguridad: PIN de acceso `0000`.

ROL: SERVICIO (MOVIMIENTOS)

- Dispositivo: Cualquiera.
- Funciones: Registro de ingresos y egresos de caja externos a la actividad de la pizzería (ej: pagos de panadería, compra de insumos).
- Seguridad: PIN de acceso `1111`.

ROL: SUPER ADMIN (DUEÑO)

- Dispositivo: Móvil/PC.
- Funciones: Gestión de permisos, alta de sabores/productos con costo y precio, visualización de recaudación total, descarga de reportes en Excel.
- Seguridad: Contraseña de acceso `admin123`.

1. REQUERIMIENTOS FUNCIONALES

3.1. INICIO DE SESIÓN
Acceso mediante selección de rol y **Código de Seguridad (PIN/Contraseña)**.

- Cajero: PIN `1234`.
- Cocina: PIN `0000`.
- Admin: Contraseña `admin123`.
La sesión es persistente para evitar cierres accidentales, pero solicita credenciales al cambiar de usuario o cerrar sesión manualmente.

3.2. MÓDULO DE CAJERO

- **Apertura de Turno (Obligatoria):**
  - Es obligatorio realizar el arqueo inicial (stock de masas y dotación de caja).
  - **Calculadora de Billetes (Guaraníes):** Interfaz con contador para billetes (100k, 50k, 20k, 10k, 5k, 2k) y monedas, con cálculo de total automático.
  - No se permite ninguna venta hasta completar este paso.
- **Cierre de Turno (Arqueo Final):**
  - Proceso obligatorio al finalizar la jornada.
  - **Dashboard de Cierre Responsivo:**
    - Diseño de doble columna (Escritorio/Tablet) para trabajar con billetes y movimientos simultáneamente.
    - Adaptabilidad a móviles (apilado vertical).
  - **Calculadora de Efectivo:**
    - Tablas de Billetes y Monedas lado a lado para optimización visual.
    - Campos de entrada compactos y cálculo automático de totales por denominación.
  - **Gestión de Movimientos Integrada:**
    - Registro de Ingresos/Egresos directamente desde el dashboard.
    - **Lista con Scroll Interno:** Visualización de los movimientos del turno sin perder de vista los totales.
    - **Corrección de Errores:** Posibilidad de eliminar movimientos individuales con recálculo automático de saldos.
  - **Navegación Fluida:**
    - Botón **"← VOLVER A VENTAS"** para salir al POS sin cerrar caja.
    - Botón exclusivo **"Cerrar Caja"** que genera el reporte y finaliza el turno.
  - **Validación de Descuadre:** El monto contado no puede ser menor al monto esperado (Dotación inicial + Ventas registradas en efectivo).
  - **Indicador de Descuadre:** Mostrar claramente si hay un faltante (valor negativo).
- **Informe de Cierre:**
  - Al cerrar caja, se descarga un archivo de texto (`.txt`) con nombre sanitizado (ej. `Cierre_Caja_2024-01-20.txt`).
  - Contenido del reporte:
    - Fecha y hora exactas.
    - Ventas totales y detalle por producto.
    - Métodos de pago (Efectivo vs Transferencia).
    - **Detalle de Movimientos:** Lista de motivos y montos de Ingresos/Egresos registrados.
    - **Detalle de Delivery:** Total recaudado por delivery, discriminando efectivo y transferencia.
    - Resumen de descuadre y justificación.
- Toma de Pedido de Pizza:
  - **Fecha:** Automática (día actual).
  - **Identificación del Cliente:**
    - Buscador de clientes (nombres almacenados en la BD).
    - Opción "Ocasional" para casos rápidos sin registro.
    - Opción de añadir nuevo cliente si no se encuentra.
  - Switch de tipo: Por defecto "Completa". Al tocar cambia a "Mitad".
  - Selección de sabores: 1 sabor para completa, 2 sabores para mitad.
  - Notas/Observaciones: Campo para añadir o quitar ingredientes.
  - Botón Agregar: Para añadir más pizzas al mismo pedido.
- Adicionales: Selección de gaseosas.
- **Tipo de Consumo:**
  - Opciones: Consumo en Local (default), Retiro en Local, Delivery.
  - **Delivery:** Incluye campo para indicar monto del servicio de delivery (para calcular ganancia en reportes).
- Flujo de Pago y Envío:
  - Selección de método: Efectivo o Transferencia.
  - **Calculadora de Vuelto:** Interfaz para ingresar el monto con el que paga el cliente y mostrar el vuelto automáticamente.
  - Selección de destino: Delivery, Local o Retiro (**Consumo en Local** tiene una distinción visual especial en cocina).
  - **Delivery:** Campo obligatorio para Monto del Servicio si se selecciona esta opción.
  - Botón "Enviar al Chef": Aparece en color NARANJA en cocina (No pagado).
  - Botón "Cobrado": Aparece en color VERDE en cocina (Pagado).
- Gestión y Resumen:
  - Ventana superior para pedidos enviados (permite editar errores o agregar productos).
  - Ventana superior para pedidos pagados/entregados (muestra recaudación acumulada).

3.3. MÓDULO DE ÚLTIMAS VENTAS (HISTORIAL RECIENTE)

- Listado de ventas recientes en orden cronológico.
- **Anulación y Modificación:**
  - Permitir anular pedidos (restaura stock).
  - Permitir modificar pedidos para agregar productos (si no se han pagado).
  - **Lógica de Cocina en Modificación:**
    - Si el pedido está "Cocinando": Actualizar la comanda existente sin mover su lugar en la fila.
    - Si el pedido ya está "Listo": Las nuevas pizzas agregadas se envían como un pedido NUEVO (sin repetir lo ya terminado).
- **Priorización:** Los pedidos pendientes de pago tienen prioridad visual sobre los ya cobrados.

3.4. PESTAÑA DE CLIENTES (NUEVO)

- Listado completo de clientes registrados.
- Buscador por nombre.
- Opción de editar o eliminar clientes.

3.3. MÓDULO DE COCINA (CHEF - VISUALIZACIÓN DE COMANDAS)

- Detalle de Comanda: Incluye Nombre del Cliente, detalle de pizzas/bebidas, observaciones.
- Cola de Pedidos: Los nuevos pedidos se agregan al final de la lista.
- Colores de Estado: Naranja (Pendiente de pago) y Verde (Pagado).
- **Distinción por Consumo:** Los pedidos para "Consumo en Local" tienen un color distintivo (Borde/Fondo especial).
- Acción: Botón "Listo" para marcar la orden como terminada.
- **Protección contra Errores:** Posibilidad de "Desmarcar" o deshacer si un pedido se marcó como listo por error.

3.4. MÓDULO DE ADMINISTRACIÓN (DUEÑO)

- **Navegación por Pestañas:**
  - **🍕 Productos:** Gestión de sabores y bebidas.
  - **📊 Estadísticas:** Dashboard con arqueo del día y contadores.
  - **📁 Reportes:** Exportación y limpieza de datos.
- **Gestión de Productos (NUEVO):**
  - Interfaz para agregar nuevos Sabores de Pizza y Bebidas.
  - Campos: Nombre, Precio, Categoría, y **Foto** (URL/Carga).
  - Estos productos se actualizan automáticamente en la vista del Cajero.
- **Dashboard de Estadísticas (NUEVO):**
  - **Arqueo del Día:** Muestra el total recaudado del día actual (Efectivo + Transferencia).
  - **Conteo de Pizzas Vendidas:** Selector para ver cantidad de pizzas vendidas por Día, Mes, o Año.
  - **Conteo de Bebidas Vendidas:** Selector para ver cantidad de bebidas vendidas por Día, Mes, o Año.
  - Los datos se calculan en tiempo real desde Firebase.
- **Extracción Inteligente:**
  - Filtro por Fechas (Desde - Hasta).
  - Botón "EXTRAER Y LIMPIAR": Genera el Excel del rango seleccionado.
  - **Limpieza de Base de Datos:** Al finalizar la extracción, el sistema pregunta si se desean limpiar (eliminar) los registros procesados de la nube para mantener el sistema optimizado.

3.5. MÓDULO DE CAJERO - STOCK EN TIEMPO REAL (NUEVO)

- **Visualización de Stock:** El indicador de "Stock de Masas" se actualiza en tiempo real conforme se venden pizzas.
- **Descuento Automático:** Al enviar un pedido con pizzas, el stock se descuenta inmediatamente (1 pizza = 1 masa).
- **Alerta de Stock Bajo:** Si el stock llega a 5 unidades o menos, el indicador cambia a color rojo/alerta.

3.6. OTROS REQUERIMIENTOS

- **Idioma:** Toda la interfaz debe estar 100% en Español.
- **Identificadores (ID):** Se utiliza un código corto (ej. 4 dígitos) para seguimiento interno. Es visible para control pero discreto.

1. ESPECIFICACIONES TÉCNICAS Y CONEXIÓN

- Base del Proyecto: El código se basa en el template funcional ore.html, optimizado para Android.
- Estructura Modular: La aplicación está organizada en tres archivos para mayor velocidad y orden:
  - `index.html`: Estructura y navegación.
  - `css/styles.css`: Diseño visual y animaciones.
  - `js/app.js`: Lógica de negocio y conexión a Firebase.
- Plataforma: Generación de archivo APK instalable en dispositivos Android.
- Backend: Firebase (Google).

1. ANÁLISIS DE LÍMITES DE FIREBASE (PLAN GRATUITO SPARK)
Según el volumen de trabajo informado (3-4 días por semana, ~25 pizzas por día, total aprox. 100-120 pizzas al mes):

- Almacenamiento (Realtime Database): El límite es de 1 GB. Un pedido promedio ocupa unos pocos kilobytes. 100 pedidos mensuales apenas consumen una mínima fracción del límite.
- Descarga de Datos: El límite es de 10 GB mensuales. La transferencia de texto de 100 pedidos es insignificante.
- Usuarios (Authentication): El límite es de 50,000 usuarios activos. La pizzería solo usará 3-5 cuentas (Cajero, Chef, Admin).
- Firestore (Estadísticas): 50,000 lecturas y 20,000 escrituras diarias. Con 25 pizzas al día, se está muy por debajo del límite de cobro.

CONCLUSIÓN TÉCNICA: El uso de Firebase en su versión gratuita es totalmente viable para el volumen actual de Ore Pizzeria, permitiendo operar sin costos mensuales de servidor.

1. INSTALACIÓN Y APK
El software se distribuirá como un archivo APK ejecutable de forma gratuita. Para su generación se recomienda el uso de Capacitor, permitiendo que el código modular HTML/JS funcione como una aplicación nativa.
