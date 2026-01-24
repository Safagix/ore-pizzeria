# 🏗️ Plan Maestro: Escalabilidad e Infraestructura

Este documento es tu mapa de ruta para crecer desde hoy (MVP Gratuito) hasta una empresa de software masiva, enfocándonos en la **economía**, **seguridad** y **disponibilidad (uptime)**.

---

## 1. 🌐 Dominios (Tu Dirección Digital)

¿Dónde comprar el `.com` más barato y seguro?

### 🥇 Top 1: Cloudflare Registrar

* **Por qué:** Venden los dominios a "precio de mayorista". No te cobran extra por renovación. Es lo más barato matemáticamente posible.
* **Seguridad:** Incluye protección contra ataques DDoS y SSL gratuito de nivel empresarial.
* **Costo:** ~$9.15 USD/año (para .com).

### 🥈 Top 2: Namecheap / Porkbun

* **Por qué:** Interfaces muy fáciles de usar, soporte excelente y precios muy competitivos.
* **Costo:** ~$10-14 USD/año. Frecuentemente tienen ofertas de $5.99 para el primer año.

### 🥉 Dominios Locales (.com.py)

* **Dónde:** NIC.py (Único proveedor oficial).
* **Costo:** ~$40 USD/año (170.000 Gs aprox).
* **Recomendación:** Solo cómpralo si quieres proteger la marca localmente. Para tecnología global, usa `.com` o `.app`.

---

## 2. 🗄️ Base de Datos (El Cerebro que "Nunca Duerme")

Buscas: *Barato + Completo + Seguro + Always On*.

### Opción A: Firebase (Google) - TU ARQUITECTURA ACTUAL

* **Tipo:** NoSQL (Documentos/JSON).
* **Costo:**
  * **Plan Spark:** **GRATIS** (Generoso, ideal para empezar).
  * **Plan Blaze:** "Pay as you go". Si te pasas del límite gratis, pagas centavos.
* **Disponibilidad:** 99.95% garantizado por Google. **Jamas se "apaga"** (Serverless).
* **Seguridad:** Reglas robustas (`auth != null`).
* **Veredicto:** ✅ **La mejor opción costo/beneficio hoy.** Al ser "Serverless", no pagas por un servidor prendido las 24hs, solo pagas cuando un cliente pide una pizza.

### Opción B: Supabase (La Alternativa PostgreSQL)

* **Tipo:** SQL (Relacional, más tradicional y potente para reportes complejos).
* **Costo:**
  * **Free:** 500MB de espacio. **OJO: Se pausa si no se usa en 7 días.**
  * **Pro:** $25 USD/mes (Aquí sí aseguras que nunca se apague).
* **Recomendación:** Úsalo si tu app necesita reportes financieron ultra complejos (SQL es mejor para eso).

### Opción C: Servidor Propio (VPS) en Hetzner/DigitalOcean

* **Tipo:** Tú alquilas una computadora Linux pequeña.
* **Costo:** ~$5 - $6 USD/mes.
* **Disponibilidad:** 100% tu responsabilidad. Si se cuelga, tú lo arreglas.
* **Veredicto:** ❌ **No recomendado** para empezar. Demasiado mantenimiento.

---

## 3. 🛡️ Hosting (Dónde vive la Web)

### 🥇 Vercel (Líder Indiscutible)

* **Costo:** **GRATIS** (Límites muy altos para proyectos personales/PyMEs).
* **Velocidad:** Usa una CDN Global (La página carga rápido en Paraguay, China o USA).
* **Escalabilidad:** Aguanta picos de tráfico virales sin caerse.
* **Integración:** Se actualiza solo al hacer `git push`.

---

## 4. 📈 Hoja de Ruta de Escalabilidad (Roadmap)

Sigue estos pasos para gastar dinero solo cuando sea necesario.

### 🟢 Nivel 1: El MVP Validado (SITUACIÓN ACTUAL)

* **Usuarios:** 0 - 5,000 visitas/mes.
* **Infraestructura:**
  * Frontend: Vercel (Hobby).
  * DB: Firebase (Spark).
  * Dominio: `.vercel.app` (Gratis).
* **Costo Mensual:** **$0 USD**.
* **Arquitectura:** Código monolítico (`app.js`), lógica mezclada.

### 🟡 Nivel 2: Profesionalización (PRÓXIMO PASO)

* **Usuarios:** Negocio estable.
* **Acciones:**
    1. **Comprar Dominio:** `orepizzeria.com` en Cloudflare (~$10/año).
    2. **Refactorizar Código:** Completar la estructura modular (`src/api`, `src/components`). Esto hace que el código sea mantenible por un equipo.
    3. **Backups:** Script automático de exportación de datos.
* **Costo Mensual:** **$0 USD** (+ $10/año dominio).

### 🟠 Nivel 3: Escala Comercial (Franquicia)

* **Usuarios:** Múltiples sucursales, miles de pedidos.
* **Acciones:**
    1. **Backend Dedicado:** Si Firebase se queda corto en lógica compleja, levantar un servidor API (Node.js) en **Railway** o **Render**.
    2. **Base de Datos SQL:** Migrar a **Supabase** (Plan Pro $25) para reportes de inteligencia de negocios.
    3. **CDN de Imágenes:** Usar Cloudinary o AWS S3 para las fotos de pizzas si tenéis millones de visitas.
* **Costo Mensual:** **$30 - $100 USD**.

---

## 5. Resumen Ejecutivo de Recomendaciónes

| Componente | Opción Recomendada | Precio | ¿Por qué? |
| :--- | :--- | :--- | :--- |
| **Dominio** | **Cloudflare** | $9.15/año | Seguridad DDoS + Precio Mayorista. |
| **Frontend** | **Vercel** | $0/mes | El estándar de la industria. Rápido y Global. |
| **Base de Datos** | **Firebase** | $0/mes | Ideal para apps tiempo real (pedidos, chats). Escala automático. |
| **Código** | **Modular (ES6)** | $0 | Mantenible, limpio y prepara el terreno para React/Vue. |

---

---

## 6. 📱 Estrategia Móvil: PWA (Web + App)

El objetivo es tener una sola base de código que funcione en Computadora y se instale en Android como una App nativa. La solución es **PWA (Progressive Web App)**.

### ¿Qué ganamos?

* **Icono en Pantalla de Inicio:** Como Instagram o WhatsApp.
* **Pantalla Completa:** Sin barra de url de Chrome.
* **Modo Offline:** Funciona incluso si se corta internet brevemente.

### Pasos para Convertir Ore Pizzeria en PWA

1. **El Carnet de Identidad (`manifest.json`)**
    Archivo que le dice a Android: "Soy una app, me llamo Ore, y este es mi icono".

    ```json
    {
      "name": "Ore Pizzeria POS",
      "short_name": "Ore POS",
      "start_url": "/index.html",
      "display": "standalone",
      "orientation": "landscape",
      "background_color": "#111",
      "icons": [ ... ]
    }
    ```

2. **El Motor Oculto (Service Worker)**
    Un script (`sw.js`) que corre de fondo y guarda archivos en caché para que la app cargue instantáneamente.

3. **Instalación**
    Una vez configurado, Chrome en Android mostrará automáticamente: *"Agregar Ore Pizzeria a la pantalla de inicio"*.

### Nivel Dios: Google Play Store

Si quieres salir en la tienda real (Play Store), no necesitas reprogramar todo en Java. Usamos **TWA (Trusted Web Activity)**.

* Es un "envoltorio" oficial de Google para subir PWAs a la tienda.
* **Herramienta:** [Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap) (CLI gratuito de Google) te genera el archivo `.apk` o `.aab` listo para subir a la consola de Play Store.
