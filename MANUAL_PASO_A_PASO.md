# 📘 Manual Paso a Paso: Desarrollo y Verificación de Software

**Objetivo:** Guía universal para construir software de calidad profesional, desde la idea hasta el mantenimiento.  
**Audiencia:** Humanos, IAs y Sistemas Automatizados.

---

## 🎯 Estructura del Manual

Este manual sigue las **8 Fases del Ciclo de Vida del Software**. Cada fase incluye:

- **Objetivo:** Qué se busca lograr.
- **Pasos Detallados:** Instrucciones específicas.
- **Herramientas Recomendadas:** Stack tecnológico sugerido.
- **Criterios de Verificación:** Cómo saber si la fase está completa.
- **Salida (Output):** Qué documento o artefacto se genera.

---

## FASE 1: 📝 Planificación & Concepto

### Objetivo

Definir **QUÉ** se va a construir y **POR QUÉ** es necesario.

### Pasos

1. **Identificar el Problema:** Escribe en 1-2 frases el problema que resuelve tu software.
   - Ejemplo: *"Los cajeros de Ore Pizzeria pierden tiempo calculando manualmente el cierre de caja."*

2. **Definir Usuarios (Roles):** Lista quiénes usarán el sistema.
   - Ejemplo: Cajero, Chef, Admin, Servicio.

3. **Establecer Objetivos SMART:**
   - **S**pecific (Específico)
   - **M**easurable (Medible)
   - **A**chievable (Alcanzable)
   - **R**elevant (Relevante)
   - **T**ime-bound (Con plazo)

4. **Crear Roadmap:** Divide el proyecto en hitos (milestones).
   - Ejemplo: Hito 1 - MVP con login y pedidos básicos (2 semanas).

### Herramientas

- **Plane** (Gestión de proyectos open source)
- **Motia** (Brainstorming visual)

### Criterios de Verificación

- [ ] Problema definido en máximo 2 frases.
- [ ] Lista de roles de usuario completa.
- [ ] Roadmap con al menos 3 hitos y fechas estimadas.

### Salida

- `ROADMAP.md` o tablero en Plane con tareas organizadas.

---

## FASE 2: 📋 Requerimientos & Documentación

### Objetivo

Escribir las **reglas del juego**: qué debe hacer el software y cómo.

### Pasos

1. **Crear PRD (Product Requirements Document):**
   - Sección 1: Resumen del Proyecto
   - Sección 2: Roles y Permisos
   - Sección 3: Funcionalidades (divididas por módulo)
   - Sección 4: Requerimientos Técnicos

2. **Definir Casos de Uso:** Escribe escenarios reales.
   - Ejemplo: *"El cajero abre la app, ingresa su PIN, registra un pedido de pizza margarita para delivery."*

3. **Especificar Reglas de Negocio:**
   - Ejemplo: *"No se permite vender si el stock de masas es 0."*

### Herramientas

- **Doku** (Documentación técnica)
- **NotebookLM** (Generar FAQs automáticas)

### Criterios de Verificación

- [ ] PRD completo con todas las secciones.
- [ ] Al menos 5 casos de uso documentados.
- [ ] Reglas de negocio críticas identificadas.

### Salida

- `PRD.md` (Product Requirements Document)

---

## FASE 3: 🎨 Diseño (UI/UX)

### Objetivo

Crear la **interfaz visual** antes de escribir código.

### Pasos

1. **Wireframes (Baja Fidelidad):** Dibuja a mano o en herramienta simple la estructura de cada pantalla.

2. **Mockups (Alta Fidelidad):** Diseña la interfaz con colores, tipografías e iconos finales.

3. **Prototipo Interactivo:** Conecta las pantallas para simular el flujo del usuario.

4. **Validar con Usuarios:** Muestra el prototipo a 2-3 usuarios reales y recoge feedback.

### Herramientas

- **Figma** (Diseño colaborativo)
- **Google Stitch** (Generación de UI con IA)
- **Lucide Icons** (Iconografía)
- **unDraw** (Ilustraciones vectoriales)

### Criterios de Verificación

- [ ] Wireframes de todas las pantallas principales.
- [ ] Mockup de alta fidelidad de al menos 3 pantallas clave.
- [ ] Prototipo navegable en Figma.
- [ ] Feedback de usuarios documentado.

### Salida

- Archivo de Figma con diseños + `FEEDBACK_DISEÑO.md`

---

## FASE 4: 💻 Programación (Frontend/Backend)

### Objetivo

Convertir el diseño en **código funcional**.

### Pasos

1. **Configurar Entorno de Desarrollo:**
   - Instalar Git, Node.js, Editor (VS Code o Void).
   - Crear repositorio en GitHub.

2. **Arquitectura del Proyecto:**
   - Definir estructura de carpetas (Frontend, Backend, Database).
   - Elegir patrón de diseño (MVC, Clean Architecture).

3. **Desarrollo Frontend:**
   - Implementar componentes UI según diseño de Figma.
   - Conectar con Backend vía APIs.

4. **Desarrollo Backend:**
   - Configurar base de datos (Supabase o Appwrite).
   - Crear APIs RESTful.
   - Implementar autenticación y autorización.

5. **Integración:**
   - Conectar Frontend con Backend.
   - Probar flujos completos (login → acción → logout).

### Herramientas

- **Frontend:** Next.js, Astro
- **Backend:** Supabase, Appwrite
- **Editor:** Void, VS Code
- **Control de Versiones:** Git + GitHub
- **Automatización:** n8n

### Criterios de Verificación

- [ ] Repositorio Git inicializado con commits regulares.
- [ ] Estructura de carpetas modular y organizada.
- [ ] Al menos 3 pantallas funcionales.
- [ ] API funcionando con al menos 5 endpoints.
- [ ] Sistema de autenticación implementado.

### Salida

- Código fuente en repositorio Git
- `ESTRUCTURA_PROYECTO.md`

---

## FASE 5: 🛠️ Testing & Calidad

### Objetivo

**Romper el software** antes de que lo hagan los usuarios.

### Pasos

1. **Testing Manual:**
   - Probar cada funcionalidad manualmente.
   - Documentar bugs encontrados en tickets.

2. **Testing Automatizado:**
   - Escribir tests unitarios (funciones individuales).
   - Escribir tests de integración (flujos completos).
   - Configurar tests E2E (End-to-End) con Playwright.

3. **Análisis de Calidad:**
   - Revisar código para detectar duplicación.
   - Verificar que el código sea "Clean Code" (entendible).

4. **Testing de Usuario (UAT):**
   - Invitar a 3-5 usuarios reales a probar la app.
   - Registrar feedback y errores.

### Herramientas

- **Playwright** (Testing automatizado)
- **Posthog** (Analíticas y grabaciones de sesión)
- **Airbyte** (Validación de datos)

### Criterios de Verificación

- [ ] Todos los flujos críticos probados manualmente.
- [ ] Al menos 10 tests automatizados escritos y pasando.
- [ ] Lista de bugs documentada y priorizada.
- [ ] Feedback de UAT recopilado.

### Salida

- `REPORTE_TESTING.md` con bugs y resultados
- Suite de tests automatizados

---

## FASE 6: 🚀 Deployment (Llevar a Producción)

### Objetivo

Hacer que el software esté **disponible para usuarios reales**.

### Pasos

1. **Preparar Entorno de Producción:**
   - Configurar dominio y certificado SSL/HTTPS.
   - Elegir servicio de hosting (Vercel, Railway, Dokploy).

2. **Configurar Variables de Entorno:**
   - Separar credenciales de producción de desarrollo.
   - Usar archivos `.env` seguros.

3. **Deploy Inicial:**
   - Subir código a servidor de producción.
   - Verificar que todo funcione correctamente.

4. **Configurar CI/CD (Opcional pero recomendado):**
   - Automatizar deployment con cada push a rama `main`.

5. **Configurar Backups:**
   - Programar backups automáticos de la base de datos.

### Herramientas

- **Hosting Frontend:** Vercel
- **Hosting Backend:** Railway, Dokploy
- **Dominio:** Namecheap, Cloudflare
- **SSL:** Let's Encrypt (gratis)
- **Colas:** Inngest

### Criterios de Verificación

- [ ] App accesible desde URL pública con HTTPS.
- [ ] Variables de entorno configuradas correctamente.
- [ ] Backups automáticos funcionando.
- [ ] Al menos 1 usuario real puede usar la app sin errores.

### Salida

- App en producción + `GUIA_DEPLOYMENT.md`

---

## FASE 7: 📈 Mantenimiento & Soporte

### Objetivo

Mantener el software **funcionando y actualizado**.

### Pasos

1. **Monitoreo Continuo:**
   - Configurar alertas para errores críticos.
   - Revisar logs diariamente.

2. **Gestión de Incidentes:**
   - Crear sistema de tickets para reportar bugs.
   - Priorizar y resolver incidentes.

3. **Actualizaciones:**
   - Aplicar parches de seguridad.
   - Actualizar dependencias regularmente.

4. **Escalabilidad:**
   - Monitorear uso de recursos (CPU, RAM, DB).
   - Escalar si es necesario (más servidores o Load Balancer).

### Herramientas

- **Monitoreo:** Signoz (Open Source APM)
- **Logs:** Sentry
- **Tickets:** Plane

### Criterios de Verificación

- [ ] Sistema de monitoreo activo con alertas configuradas.
- [ ] Logs accesibles y organizados.
- [ ] Proceso documentado para resolver incidentes.
- [ ] Al menos 1 actualización de seguridad aplicada.

### Salida

- Dashboard de monitoreo + `MANUAL_SOPORTE.md`

---

## FASE 8: 🔄 Feedback & Evolución

### Objetivo

**Escuchar a los usuarios** y mejorar continuamente.

### Pasos

1. **Recopilar Feedback:**
   - Analizar datos de Posthog (dónde se pierden usuarios).
   - Leer comentarios y sugerencias.

2. **Priorizar Mejoras:**
   - Crear lista de features solicitadas.
   - Ordenar por impacto vs esfuerzo.

3. **Planificar Siguiente Iteración:**
   - Volver a FASE 1 con nuevos objetivos.
   - Repetir el ciclo.

### Herramientas

- **Posthog** (Analíticas de comportamiento)
- **Plane** (Gestión de nuevas features)

### Criterios de Verificación

- [ ] Reporte de analíticas generado.
- [ ] Lista de mejoras priorizadas.
- [ ] Roadmap actualizado para próxima versión.

### Salida

- `FEEDBACK_USUARIOS.md` + Roadmap v2

---

## ✅ Checklist Final de Verificación

Antes de considerar el software "completo", verifica:

- [ ] **Funcionalidad:** Todas las features del PRD implementadas.
- [ ] **Seguridad:** HTTPS activo, autenticación robusta.
- [ ] **Performance:** Tiempos de carga < 3 segundos.
- [ ] **Usabilidad:** Al menos 5 usuarios pueden usarlo sin ayuda.
- [ ] **Documentación:** PRD, Guía de Deploy y Manual de Soporte completos.
- [ ] **Backups:** Sistema de respaldo funcionando.
- [ ] **Monitoreo:** Logs y alertas configuradas.

---

## 💡 Consejos Finales

1. **No saltes fases:** Cada una tiene un propósito. Saltarse Testing es la receta para el desastre.
2. **Documenta TODO:** Tu yo del futuro te lo agradecerá.
3. **Itera rápido:** Es mejor lanzar un MVP imperfecto que esperar 6 meses por la "versión perfecta".
4. **Automatiza lo repetitivo:** Usa n8n para tareas como enviar reportes o backups.

---

*Este manual combina [GUIA_DESARROLLO_PRO.md](GUIA_DESARROLLO_PRO.md) y [DICCIONARIO_DEV.md](DICCIONARIO_DEV.md). Úsalo como tu biblia de desarrollo.*
