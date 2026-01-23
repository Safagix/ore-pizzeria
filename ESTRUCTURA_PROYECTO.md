# Ore Pizzeria APP - Estructura del Proyecto

Este documento explica cada archivo y carpeta del proyecto.

---

## 📁 Carpetas

### `/css/`

Contiene los estilos visuales de la aplicación.

- **`styles.css`**: Define la apariencia visual (colores, tipografía, layout). Usa variables CSS para el branding (dorado, negro, marrón terroso).

### `/js/`

Contiene la lógica de la aplicación.

- **`app.js`**: El "cerebro" de la app. Maneja:
  - Conexión a Firebase
  - Login por roles (Cajero, Chef, Admin)
  - Gestión de pedidos (crear, enviar, marcar listo)
  - Apertura/Cierre de turno y arqueo
  - Exportación a Excel
  - Gestión dinámica de productos

---

## 📄 Archivos HTML

### `index.html` ⭐ (Principal)

**La versión de producción.** Es el archivo que se debe usar. Contiene:

- Pantalla de Login con PIN
- Módulo Cajero (hacer pedidos)
- Módulo Chef (ver pedidos en cocina)
- Módulo Admin (exportar ventas, agregar productos)

### `ore.html`

**Copia de seguridad/testing.** Debería ser idéntico a `index.html`. Se mantiene para pruebas rápidas sin tocar el archivo principal. Actualmente sincronizado.

### `template ore.html`

**Archivo legacy/de referencia.** Era la plantilla original antes de la modularización. **No se usa en producción.** Puedes ignorarlo o eliminarlo.

---

## 📄 Otros Archivos

### `prd.md`

**Product Requirements Document (Documento de Requisitos)**. Define las funcionalidades del sistema:

- Roles y permisos
- Lógica de apertura/cierre de caja
- Flujo de pedidos
- Requisitos de exportación

---

## 🗄️ Estructura de Firebase (Base de Datos)

```
ore-pizza-default-rtdb/
├── orders/           # Pedidos (creados por Cajero, vistos por Chef)
├── products/
│   ├── flavors/      # Sabores de pizza (Muzzarella, Pepperoni...)
│   └── drinks/       # Bebidas (Coca-Cola, Agua...)
└── config/
    └── lastOrderId   # Contador para IDs secuenciales (1001, 1002...)
```

---

## 🔄 Resumen de Flujo

```
index.html (UI) ──► app.js (lógica) ──► Firebase (datos)
                        │
                        └───► styles.css (apariencia)
```
