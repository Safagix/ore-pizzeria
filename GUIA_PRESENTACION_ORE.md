# 🍕 Guía de Presentación - Ore Pizzeria POS

Este documento ha sido diseñado para que puedas estudiar el funcionamiento del sistema y presentarlo de manera profesional al dueño de la pizzería.

---

## 🔐 1. Credenciales de Acceso (PINs)

El sistema cuenta con 4 niveles de acceso, cada uno con permisos específicos para mantener el orden y la seguridad.

| Rol | PIN de Acceso | Función Principal |
| :--- | :--- | :--- |
| **Cajero** | `1234` | Toma pedidos, gestiona clientes, abre y cierra caja. |
| **Chef (Cocina)** | `0000` | Visualiza los pedidos entrantes en tiempo real y marca cuando están listos. |
| **Administrador** | `admin123` | Gestión de productos (precios, fotos), ver estadísticas y reportes de ventas. |
| **Servicio** | `1111` | Registro rápido de movimientos de dinero (Ingresos/Egresos) fuera de ventas. |

---

## 🛠️ 2. ¿Cómo funciona la App? (Flujo de Trabajo)

La aplicación sigue el proceso natural de una pizzería:

1. **Apertura de Turno (Cajero):** Al ingresar, el cajero realiza el conteo de dinero inicial y registra cuántas masas y bebidas hay en stock.
2. **Toma de Pedido:**
    * Se selecciona la pizza (Entera o Mitad y Mitad).
    * Se agregan ingredientes extra u observaciones.
    * Se asigna un cliente (nuevo o recurrente).
    * Se elige el método de pago (Efectivo o Transferencia) y tipo de entrega (Local, Retiro o Delivery).
3. **Cocina en Acción:** El pedido aparece instantáneamente en la pantalla del **Chef**. Una vez que la pizza sale del horno, el Chef la marca como "Lista".
4. **Cierre de Caja:** Al terminar el turno, el sistema descarga automáticamente un **Informe de Cierre (.txt)** detallando:
    * Ventas totales por método de pago.
    * Diferencia entre dinero esperado y dinero contado.
    * Stock restante.
    * Detalle de productos más vendidos.

---

## 🚀 3. ¿Qué se usó para construirla? (Stack Tecnológico)

Para garantizar rapidez, seguridad y que funcione en cualquier dispositivo (Celular, Tablet o PC), se utilizaron las siguientes tecnologías de nivel profesional:

* **Lenguajes Core:** HTML5, CSS3 y JavaScript (Vanilla). Esto asegura que la web sea liviana y cargue rápido.
* **Base de Datos (Firebase):** Es la tecnología de Google que permite que los pedidos viajen de la caja a la cocina en milisegundos, sin necesidad de recargar la página.
* **Hosting (Vercel):** La plataforma donde vive la aplicación, permitiendo que sea accesible desde cualquier lugar mediante una URL segura.
* **Seguridad:** Implementación de "Hashing" de contraseñas (para que nadie pueda ver los PINs en la base de datos) y Reglas de Seguridad de Firebase para proteger el acceso a los datos.

---

## ✨ 4. Puntos clave para resaltar al dueño

1. **Sincronización Total:** Lo que se marca en la caja, se ve en la cocina al instante. No más gritos ni papeles perdidos.
2. **Control de Stock Crítico:** El sistema avisa cuando quedan pocas masas, evitando perder ventas.
3. **Transparencia Financiera:** El reporte de cierre de caja evita errores humanos y asegura que el dinero coincida con las ventas.
4. **Base de Datos de Clientes:** Permite conocer a los clientes frecuentes y agilizar su atención.
5. **Diseño Móvil Primero:** Se puede usar perfectamente desde un celular, ideal para que los mozos tomen pedidos en las mesas.

---

*Desarrollado con estándares de código profesional para Ore Pizzeria.*
