# 🏗️ Plan Maestro de Escalabilidad y Arquitectura

Este documento define la estrategia para transformar **Ore Pizzeria** de un MVP (Producto Mínimo Viable) a una aplicación de software profesional, robusta y fácil de escalar.

> **Filosofía:** "Divide y Vencerás". La clave de la escalabilidad es la modularización.

---

## 1. Diagnóstico Actual (El Monolito)

Actualmente, tenemos una arquitectura centralizada:

* **`app.js`:** Contiene TODA la lógica (Base de datos, UI, Eventos, Estado).
* **`index.html`:** Contiene TODA la estructura visual.
* **Riesgo:** Si la app crece, `app.js` se volverá inmanejable ("Spaghetti Code"), haciendo que añadir nuevas funciones sea lento y propenso a errores.

---

## 2. La Nueva Arquitectura (Propuesta)

Para escalar, adoptaremos una arquitectura en capas (Layered Architecture) usando **ES Modules** (JavaScript Moderno). No necesitamos React/Vue todavía para ser profesionales, solo orden.

### Estructura de Carpetas Objetivo

```text
d:/Ore pizzeria APP/
├── 📂 src/                  # Código fuente limpio
│   ├── 📂 api/              # Conexión pura con Firebase (Nadie más toca Firebase)
│   │   ├── firebase.js      # Inicialización
│   │   ├── products.js      # CRUD de productos
│   │   └── orders.js        # CRUD de pedidos
│   ├── 📂 components/       # Lógica de Clases UI (Renderizado)
│   │   ├── ProductCard.js
│   │   ├── Cart.js
│   │   └── Modal.js
│   ├── 📂 utils/            # Funciones puras (Formatos de moneda, fechas)
│   │   └── formatters.js
│   └── main.js              # Punto de entrada (Orquestador)
├── 📂 public/               # Archivos estáticos
│   ├── 📂 content/          # Imágenes subidas
│   └── 📂 css/
├── index.html               # HTML limpio (solo contenedores vacíos)
└── vercel.json
```

---

## 3. Hoja de Ruta de Refactorización

No haremos todo de golpe para no romper la app. Lo haremos en fases:

### FASE 1: Separación de Responsabilidades (Inmediato)

* **Objetivo:** Sacar la lógica de Firebase fuera de `app.js`.
* **Acción:** Crear carpeta `services/` y mover `seedDatabase`, `fetchProducts`, `saveOrder` a archivos aislados.
* **Beneficio:** Si cambiamos Firebase por otra cosa en el futuro, solo tocamos `services/`. La UI no se entera.

### FASE 2: Modularización de UI

* **Objetivo:** Que `renderFlavors` no sea una función gigante concatenando strings HTML.
* **Acción:** Crear pequeñas funciones/componentes que retornen elementos DOM o Strings HTML específicos.
* **Beneficio:** Reutilización de código (el botón de "Agregar" se ve igual en todos lados).

### FASE 3: Optimización de Base de Datos (Firebase)

* **Indexing:** Crear índices en Firebase Console para búsquedas rápidas (ej. buscar pedidos por fecha o cliente).
* **Archivado:** Implementar función Cloud para mover pedidos viejos de `/orders` a `/history` automáticamente, manteniendo la app rápida.

---

## 4. Estrategia de Ramas (Git Flow Simplificado)

Para trabajar ordenadamente sin romper la versión pública:

1. **`main`:** Código sagrado. Lo que está aquí es lo que ve el cliente en Vercel.
2. **`develop`:** Donde integramos los cambios del día.
3. **`feature/nueva-cosa`:** Ramas temporales para trabajar (ej. `feature/refactor-auth`).

**Regla de Oro:** Nunca comitear directo a `main`.

---

## 5. Próximos Pasos (Para el Usuario)

1. **Aprobar esta Estructura:** ¿Te parece bien organizar las carpetas así?
2. **Ejecución FASE 1:** Comenzar a extraer la lógica de Firebase a `services/`.
