# 📔 Manual Maestro: Replicación de Arqueo de Caja (Ore Pizzeria)

Este documento es una guía técnica definitiva para replicar exactamente el módulo de **Arqueo y Cierre de Caja** desarrollado para Ore Pizzeria, tal como se muestra en las imágenes de referencia.

---

## 📸 Referencia Visual (Mapa de la UI)

### Imagen 1: La Calculadora y Movimientos

1. **Encabezado:** Título "Cierre de Caja".
2. **Calculadora:** Dos columnas (Billetes y Monedas) con campos de cantidad que calculan subtotales al instante.
3. **Total Contado:** Barra negra destacada que suma todo lo ingresado en la calculadora.
4. **Formulario de Movimientos:** Campos para registrar Gastos (Egresos) o Ingresos Extra durante el cierre.

### Imagen 2: Resumen y Comparación

1. **Lista de Movimientos:** Visualización de lo que se agregó (ej. "pago muni" en rojo).
2. **Detalle Esperado:** Desglose automático de Caja Inicial + Ventas + Ingresos - Gastos.
3. **Resultado Final:** Comparativa entre "Total en Caja" y "Diferencia" con semáforo de colores (Verde: Perfecto, Rojo: Faltante).

---

## 🛠 Paso 1: Estructura Frontend (HTML)

Copia este bloque dentro de tu contenedor de modales. Utiliza IDs únicos para la vinculación con Javascript.

```html
<!-- Modal de Arqueo -->
<div id="modal-new-close" class="modal hidden" style="z-index: 16000;">
    <div class="modal-content" style="max-width: 600px; width: 95%; height: 90vh; display: flex; flex-direction: column; background: #1a1a1a; border: 2px solid #d4af37;">
        
        <!-- Header -->
        <div style="padding: 20px; border-bottom: 1px solid #333; display: flex; justify-content: space-between; align-items: center;">
            <h2 style="margin: 0; color: #d4af37; font-family: serif;">Cierre de Caja</h2>
            <button onclick="document.getElementById('modal-new-close').classList.add('hidden')" style="background:none; border:none; color:white; font-size:1.5rem; cursor:pointer;">&times;</button>
        </div>

        <div style="flex: 1; overflow-y: auto; padding: 20px;">
            <!-- 1. CALCULADORA -->
            <h3 style="color: white; border-bottom: 2px solid #555; padding-bottom: 5px;">1. Calculadora de Billetes (Gs)</h3>
            <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                <div style="flex: 1;">
                    <h4 style="color: #aaa;">BILLETES</h4>
                    <div id="new-bills-container"></div>
                </div>
                <div style="flex: 1;">
                    <h4 style="color: #aaa;">MONEDAS</h4>
                    <div id="new-coins-container"></div>
                </div>
            </div>

            <div style="background: #000; padding: 15px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
                <span style="color: #888;">TOTAL CONTADO</span><br>
                <span id="new-total-counted" style="font-size: 1.8rem; font-weight: bold; color: #4caf50;">Gs. 0</span>
            </div>

            <!-- 2. MOVIMIENTOS -->
            <h3 style="color: white; border-bottom: 2px solid #555; padding-bottom: 5px;">2. Registro Movimientos</h3>
            <div style="display: grid; grid-template-columns: 1fr 100px auto auto; gap: 10px;">
                <input type="text" id="new-mov-desc" placeholder="Descripción" style="background:#222; color:white; border:1px solid #444; padding:8px;">
                <input type="number" id="new-mov-amount" placeholder="Monto" style="background:#222; color:white; border:1px solid #444; padding:8px;">
                <select id="new-mov-type" style="background:#222; color:white; border:1px solid #444; padding:8px;">
                    <option value="egreso">Egreso</option>
                    <option value="ingreso">Ingreso</option>
                </select>
                <button onclick="app.addNewMovement()" style="background:#d4af37; border:none; padding:10px; cursor:pointer; font-weight:bold;">AGREGAR</button>
            </div>
            <div id="new-mov-list" style="margin-top:10px;"></div>

            <!-- 3. RESUMEN FINAL -->
            <div style="background: #222; padding: 15px; border-radius: 8px; margin-top:30px;">
                <h3 style="border-bottom: 1px solid #444;">DETALLE ESPERADO</h3>
                <div id="resumen-fields" style="font-size: 0.9rem;">
                    <p>Caja Chica (Inicio): <span id="summ-petty" style="float:right">0</span></p>
                    <p>Total Ventas: <span id="summ-sales" style="float:right">0</span></p>
                    <p style="color:#4caf50">+ Ingresos Extra: <span id="summ-in" style="float:right">0</span></p>
                    <p style="color:#f44336">- Gastos/Retiros: <span id="summ-out" style="float:right">0</span></p>
                    <hr style="border:0; border-top:1px solid #444;">
                    <p style="font-size:1.2rem; font-weight:bold;">TOTAL EN CAJA: <span id="summ-expected" style="float:right; color:#4caf50">0</span></p>
                    <div id="new-diff-box" style="text-align:center; padding:10px; background:#111;">
                        <span id="summ-diff" style="font-size:1.3rem; color:#888;">--</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div style="padding: 20px; border-top: 1px solid #333; display: flex; gap: 10px;">
            <button onclick="document.getElementById('modal-new-close').classList.add('hidden')" style="flex:1; background:#333; color:white; border:none; padding:15px; border-radius:4px;">&larr; VOLVER A VENTAS</button>
            <button onclick="app.executeNewClose()" style="flex:1; background:#d4af37; color:black; border:none; padding:15px; font-weight:bold; border-radius:4px;">CERRAR CAJA</button>
        </div>
    </div>
</div>
```

---

## 🎨 Paso 2: Estilos (CSS Esencial)

Para que el modal sea responsive y se vea como en la imagen, usa estas reglas:

```css
/* Centrado del Modal */
.modal {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.85); display: flex; justify-content: center; align-items: center;
}

/* Scroll interno para evitar que se pierdan botones en pantallas chicas */
.modal-content {
    max-height: 95vh;
    animation: slideIn 0.3s ease;
}

@keyframes slideIn {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}

/* Estilo de inputs de la calculadora */
.new-cash-input {
    width: 60px; background: #111; border: 1px solid #444; 
    color: white; padding: 5px; text-align: right; font-size: 1rem;
}
```

---

## 🧠 Paso 3: Lógica de Negocio (Javascript)

Esta es la orquestación total. Requiere un objeto `APP_STATE` para manejar variables globales.

### 1. Inicialización (Apertura del Modal)

Genera dinámicamente los campos de la calculadora para evitar código repetitivo en HTML.

```javascript
app.launchNewClose = async function() {
    const modal = document.getElementById('modal-new-close');
    modal.classList.remove('hidden');

    const bills = [100000, 50000, 20000];
    const coins = [10000, 5000, 2000, 1000, 500, 100, 50];

    const renderInput = (v) => `
        <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
            <span style="color:#888;">${v.toLocaleString()}</span>
            <input type="number" class="new-cash-input" data-val="${v}" placeholder="0" oninput="app.recalcNewTotal()">
        </div>`;

    document.getElementById('new-bills-container').innerHTML = bills.map(renderInput).join('');
    document.getElementById('new-coins-container').innerHTML = coins.map(renderInput).join('');

    await this.updateNewCloseStats(); // Carga de datos desde Database
    this.renderNewMovements();      // Dibuja la lista de gastos
};
```

### 2. Cálculos en Tiempo Real

Suma el dinero físico ingresado por el usuario.

```javascript
app.recalcNewTotal = function() {
    let total = 0;
    document.querySelectorAll('.new-cash-input').forEach(input => {
        const val = parseInt(input.getAttribute('data-val'));
        const count = parseInt(input.value) || 0;
        total += val * count;
    });

    APP_STATE._currentCalcTotal = total;
    document.getElementById('new-total-counted').textContent = `Gs. ${total.toLocaleString()}`;
    this.updateNewCloseDiff(); // Compara con el sistema
};
```

### 3. Comparativa (El Semáforo)

Indica si falta dinero o si la caja está perfecta.

```javascript
app.updateNewCloseDiff = function() {
    const counted = APP_STATE._currentCalcTotal || 0;
    const expected = APP_STATE.expectedCash || 0;
    const diff = counted - expected;
    const diffEl = document.getElementById('summ-diff');

    if (diff === 0) {
        diffEl.textContent = "PERFECTO (Gs. 0)";
        diffEl.style.color = "#4caf50";
    } else if (diff > 0) {
        diffEl.textContent = `SOBRANTE (+ Gs. ${diff.toLocaleString()})`;
        diffEl.style.color = "#2196f3";
    } else {
        diffEl.textContent = `FALTANTE (Gs. ${diff.toLocaleString()})`;
        diffEl.style.color = "#f44336";
    }
};
```

### 4. Ejecución del Cierre (Backend / Firebase)

Pasos finales antes de reiniciar la aplicación:

1. Descarga el reporte `.txt`.
2. Mueve órdenes a `orders_archive`.
3. Cambia estado de tienda a `closed`.
4. Limpia `localStorage`.
5. Recarga la página.

---

## 📌 Notas de Implementación (Tips)

* **Z-Index:** Asegúrate que el modal tenga un `z-index` alto (ej. 16000) para quedar por encima de cualquier otro elemento.
* **Confirmación:** Siempre pide confirmación (`confirm`) si el usuario intenta cerrar con un Faltante muy grande.
* **Seguridad:** El borrado del `localStorage` al final es vital para evitar que el siguiente turno herede datos del cajero anterior.
