# 🚀 Plan de Implementación: Fase 2 (Optimización y Operaciones) - Revisado

Este plan aborda los puntos críticos identificados en la **Decisión Final** para llevar la app de un "Sistema Seguro" a un "Sistema de Alto Rendimiento", respetando los límites del PRD original.

---

## 1. 📊 Optimización del Panel Administrativo (Admin Stats)

**Problema:** El sistema se vuelve lento al cargar miles de pedidos históricos.

### Cambios Propuestos

- **Indexación en Firebase:** Actualizar las reglas de seguridad para indexar pedidos por fecha (`.indexOn: ["date"]`).
- **Consultas Filtradas:** En `app.js`, cambiar la carga de estadísticas para que use filtros reales de Firebase (solo cargar el día actual por defecto).
- **Pestaña Histórica:** Crear una vista de "Carga bajo demanda" para periodos específicos (mes/año), evitando saturar la memoria del dispositivo con datos innecesarios.

---

## 2. 👨‍🍳 Mejora de Flujo en Cocina (UX)

**Problema:** Saturación visual y falta de feedback auditivo para el chef.

### Cambios Propuestos

- **Botón Deshacer (Undo):** Agregar un botón para recuperar rápidamente un pedido marcado como "Listo" por error.
- **Paginación/Límites:** Mostrar solo los pedidos más urgentes en pantalla para evitar el scroll infinito.
- **Alertas Sonoras:** Implementar un sonido de aviso (ping) cuando entra un pedido nuevo, permitiendo que el chef no dependa 100% de mirar la pantalla.

---

## 3. 🍕 Flexibilidad de Stock (Modo Emergencia)

**Problema:** El sistema bloquea las ventas si el stock llega a cero, incluso si el local tiene insumos físicos.

### Cambios Propuestos

- **Modo "Ignorar Stock":** Opción en el menú de Admin para permitir ventas sin restricciones de stock (ideal para días de mucha demanda donde no hay tiempo de cargar el sistema).
- **Control Visual vs Bloqueo:** Cambiar el bloqueo duro por una advertencia visual persistente, permitiendo que el cajero decida si enviar el pedido o no.

---

## 📋 Cuadro de Prioridades

| Tarea | Impacto | Complejidad | Prioridad |
| :--- | :--- | :--- | :--- |
| **Optimizar Consultas (Admin)** | Alto (Evita crasheos) | Media | 🔴 **CRÍTICA** |
| **Mejoras UX Cocina** | Medio (Velocidad) | Baja | 🟡 **ALTA** |
| **Modo Emergencia Stock** | Medio (Flexibilidad) | Baja | 🟡 **ALTA** |

---

> [!NOTE]
> Se ha eliminado el módulo de Impresión por no formar parte del alcance del PRD original y manejarse la facturación de forma externa.
