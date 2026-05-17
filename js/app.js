// CONFIG
const firebaseConfig = CONFIG.firebase;

const APP_STATE = {
    role: null,
    stock: 0,
    stockDrinks: 0,
    pettyCash: 0,
    expectedCash: 0,
    stockActive: false,
    shiftSales: {
        total: 0,
        efectivo: 0,
        transfer: 0,
        deliveryFees: 0,
        deliveryEfectivo: 0,
        deliveryTransfer: 0,
        items: {}
    },
    pizzaMode: 'full',
    selectedFlavors: [],
    cart: [],
    _editingOrderKey: null,
    products: {
        flavors: [],
        drinks: []
    },
    clients: [],
    dbRef: null
};

const app = {
    _AUTH_HASHES: {
        'cashier': '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', // 1234
        'chef': '9af15b336e6a9619928537df30b2e6a2376569fcf9d7e773eccede65606529a0',    // 0000
        'admin': '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',   // admin123
        'service': '0ffe1abd1a08215353c233d6e009613e95eec4253832a761af28ff37ac5a150c' // 1111
    },

    hashPin: async function (pin) {
        if (!window.crypto || !window.crypto.subtle) {
            console.warn("Web Crypto API not available. Check if you are in a secure context (HTTPS/localhost).");
            return null;
        }
        const msgBuffer = new TextEncoder().encode(pin);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    },

    escapeHtml: function (text) {
        if (!text) return text;
        return text.toString()
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    },

    init: function () {
        const loader = document.getElementById('loader');
        try {
            if (typeof firebase === 'undefined') throw new Error("Firebase SDK not loaded");
            firebase.initializeApp(firebaseConfig);

            APP_STATE.dbRef = firebase.database().ref('orders');

            console.log("Firebase Connected");

            // Fetch Products
            this.fetchProducts();
            this.fetchClients();

            loader.style.opacity = '0';
            setTimeout(() => loader.classList.add('hidden'), 500);

            this.initCalculator();
            this.initFileInputListener();
        } catch (e) {
            console.error(e);
            alert("Error conectando a DB: " + e.message);
            loader.classList.add('hidden');
        }
    },

    fetchProducts: function () {
        // Auth Anónimo para permitir reglas de seguridad básicas
        firebase.auth().signInAnonymously().catch(function (error) {
            console.error("Auth Error", error);
        });

        firebase.database().ref('products').on('value', snap => {
            const data = snap.val();
            if (!data) {
                this.seedDatabase(); // Primera ejecución
            } else {
                // Convertir objeto a array
                APP_STATE.products.flavors = data.flavors ? Object.values(data.flavors) : [];
                APP_STATE.products.drinks = data.drinks ? Object.values(data.drinks) : [];
                this.renderFlavors(); // Re-renderizar si está abierto
            }
        });
    },

    seedDatabase: function () {
        // Carta Oficial Ore Pizzeria
        const initialFlavors = [
            { id: 'mus', name: 'Mozzarella', price: 40000, cat: 'flavors', ingredients: 'Salsa de tomate, queso mozzarella, orégano, hojas de Albahaca, aceitunas' },
            { id: 'pep', name: 'Pepperoni', price: 45000, cat: 'flavors', ingredients: 'Salsa de tomate, queso mozzarella, orégano, pepperoni, aceitunas' },
            { id: 'pal', name: 'Palmito', price: 45000, cat: 'flavors', ingredients: 'Salsa de tomate, queso mozzarella, orégano, palmito, salsa golf, aceitunas' },
            { id: 'cat', name: 'Catupiry con pollo', price: 45000, cat: 'flavors', ingredients: 'Salsa de tomate, queso mozzarella, queso catupiry, pollo desmechado, orégano, aceitunas' },
            { id: 'nap', name: 'Napolitana', price: 45000, cat: 'flavors', ingredients: 'Salsa de tomate, queso mozzarella, rodajas de tomate, orégano, jamón en cubitos, ajo, hojas de albahaca, aceitunas' },
            { id: 'cho', name: 'Choclo con catupiry', price: 45000, cat: 'flavors', ingredients: 'Salsa de tomate, queso mozzarella, queso catupiry, choclo, orégano, aceitunas' },
            { id: 'cip', name: 'La Cipolla', price: 46000, cat: 'flavors', ingredients: 'Salsa de tomate, queso mozzarella, orégano, queso azul, cebolla caramelizada, panceta, aceitunas' },
            { id: 'veg', name: 'Vegetariana', price: 46000, cat: 'flavors', ingredients: 'Salsa de tomate, queso mozzarella, orégano, cherry, choclo, cebolla morada, palmito, locote verde, aceitunas' },
            { id: 'arr', name: 'El Arriero', price: 50000, cat: 'flavors', ingredients: 'Salsa de tomate, queso mozzarella, chorizo picante, cebolla morada, locote en julianas, orégano, aceitunas, salsa picante casera' }
        ];
        const initialDrinks = [
            { id: 'coke500', name: 'Coca Cola 500ml', price: 9000, cat: 'drinks' },
            { id: 'coke15', name: 'Coca Cola 1.5L', price: 15000, cat: 'drinks' },
            { id: 'water500', name: 'Agua 500 ml', price: 5000, cat: 'drinks' },
            { id: 'water1', name: 'Agua 1 L', price: 7000, cat: 'drinks' }
        ];

        initialFlavors.forEach(p => firebase.database().ref('products/flavors').push(p));
        initialDrinks.forEach(p => firebase.database().ref('products/drinks').push(p));
        console.log("Base de datos actualizada con Carta Oficial.");
    },

    // Herramienta de migración
    forceUpdateMenu: function () {
        if (confirm("¿Seguro que quieres borrar el menú actual y cargar la Carta Oficial?")) {
            firebase.database().ref('products').remove()
                .then(() => {
                    // El listener de fetchProducts detectará que está vacía y la llenará automáticamente
                    alert("Menú actualizado exitosamente. Recarga la página.");
                    window.location.reload();
                });
        }
    },

    addProduct: function () {
        const name = document.getElementById('prod-name').value;
        const price = parseInt(document.getElementById('prod-price').value);
        const cat = document.getElementById('prod-category').value;
        const fileInput = document.getElementById('prod-img');
        const file = fileInput.files[0];

        if (!name || isNaN(price)) return alert("Por favor completa Nombre y Precio");

        const saveProduct = (imgData) => {
            const newProd = {
                id: Date.now().toString(),
                name: name,
                price: price,
                img: imgData || '',
                cat: cat
            };

            firebase.database().ref(`products/${cat}`).push(newProd, (error) => {
                if (error) alert("Error: " + error.message);
                else {
                    alert("Producto Agregado Correctamente");
                    // Clear inputs
                    document.getElementById('prod-name').value = '';
                    document.getElementById('prod-price').value = '';
                    document.getElementById('prod-img').value = '';
                    document.getElementById('prod-img-name').textContent = 'Sin imagen';
                }
            });
        };

        // If file selected, convert to base64
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => saveProduct(e.target.result);
            reader.readAsDataURL(file);
        } else {
            saveProduct('');
        }
    },

    // File picker display name update
    initFileInputListener: function () {
        const fileInput = document.getElementById('prod-img');
        if (fileInput) {
            fileInput.addEventListener('change', () => {
                const nameSpan = document.getElementById('prod-img-name');
                if (fileInput.files.length > 0) {
                    nameSpan.textContent = fileInput.files[0].name;
                } else {
                    nameSpan.textContent = 'Sin imagen';
                }
            });
        }
    },

    initCalculator: function () {
        // Dynamic population of tables
        const bills = [100000, 50000, 20000];
        const coins = [10000, 5000, 2000, 1000, 500, 100, 50];

        const billsBody = document.getElementById('bills-body');
        const coinsBody = document.getElementById('coins-body');

        if (billsBody) {
            billsBody.innerHTML = bills.map(v => `
                <tr>
                    <td>${v.toLocaleString()}</td>
                    <td><input type="number" class="cash-calc" data-val="${v}" placeholder="0" oninput="app.updateDashTotal()"></td>
                    <td id="total-${v}">0</td>
                </tr>
            `).join('');
        }

        if (coinsBody) {
            coinsBody.innerHTML = coins.map(v => `
                <tr>
                    <td>${v.toLocaleString()}</td>
                    <td><input type="number" class="cash-calc" data-val="${v}" placeholder="0" oninput="app.updateDashTotal()"></td>
                    <td id="total-${v}">0</td>
                </tr>
            `).join('');
        }
    },

    updateDashTotal: function () {
        const inputs = document.querySelectorAll('.cash-calc');
        let grandTotal = 0;

        inputs.forEach(i => {
            const count = parseInt(i.value) || 0;
            const val = parseInt(i.getAttribute('data-val'));
            const rowTotal = count * val;
            grandTotal += rowTotal;

            const totalCell = document.getElementById(`total-${val}`);
            if (totalCell) totalCell.textContent = rowTotal.toLocaleString();
        });

        const display = document.getElementById('calc-total-display');
        if (display) display.textContent = grandTotal.toLocaleString();
        APP_STATE._currentCalcTotal = grandTotal;

        // Update Difference if in closing dashboard
        const diffContainer = document.getElementById('diff-container');
        if (diffContainer && !diffContainer.classList.contains('hidden')) {
            const expected = APP_STATE.expectedCash;
            const diff = grandTotal - expected;
            const diffDisplay = document.getElementById('diff-display');
            diffDisplay.textContent = `Gs. ${diff.toLocaleString()}`;
            diffDisplay.style.color = diff < 0 ? '#f44336' : (diff > 0 ? '#4caf50' : '#fff');
        }
    },

    // --- SEQUENTIAL ID LOGIC ---
    getNextId: function (callback) {
        const counterRef = firebase.database().ref('config/lastOrderId');
        counterRef.transaction(currentValue => {
            return (currentValue || 1000) + 1;
        }, (error, committed, snapshot) => {
            if (error) {
                console.error("ID Transaction failed: ", error);
                callback(Date.now().toString().slice(-4)); // Fallback
            } else if (committed) {
                callback(snapshot.val()); // Returns 1001, 1002, etc.
            }
        });
    },

    // --- AUTH & NAV ---
    login: async function () {
        const role = document.getElementById('role-select').value;
        const pin = document.getElementById('login-pin').value;

        if (!role) return alert("Selecciona un rol");
        if (!pin) return alert("Ingresa el PIN");

        // Use SHA-256 hashing for PIN verification (Security fix)
        const pinHash = await app.hashPin(pin);

        if (!pinHash) {
            return alert("Error de seguridad: La autenticación requiere un contexto seguro (HTTPS o localhost).");
        }

        if (pinHash !== app._AUTH_HASHES[role]) {
            return alert("PIN Incorrecto para " + role.toUpperCase());
        }

        APP_STATE.role = role;
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('app-screen').classList.remove('hidden');
        document.getElementById('user-display').textContent = `Rol: ${role.toUpperCase()}`;

        // Hide all views first
        document.querySelectorAll('.content-view').forEach(el => el.classList.add('hidden'));

        if (role === 'cashier') {
            document.getElementById('view-cashier').classList.remove('hidden');
            document.getElementById('nav-cashier').classList.remove('hidden');
            // Show opening dashboard
            this.requestOpenShift();
            this.listenOrdersGeneric();
        } else if (role === 'chef') {
            document.getElementById('view-chef').classList.remove('hidden');
            this.listenChef();
        } else if (role === 'admin') {
            document.getElementById('view-admin').classList.remove('hidden');
            this.loadAdminStats(); // Load statistics
        } else if (role === 'service') {
            document.getElementById('view-service').classList.remove('hidden');
            this.initServiceView();
        }
    },

    setStock: function () {
        const s = parseInt(document.getElementById('init-stock').value);
        const d = parseInt(document.getElementById('init-stock-drinks').value) || 0;
        const calcTotal = APP_STATE._currentCalcTotal || 0;

        if (isNaN(s)) return alert("Debes ingresar el stock de masas para abrir el turno");
        if (calcTotal === 0) if (!confirm("¿Deseas abrir la caja con Gs. 0?")) return;

        APP_STATE.stock = s;
        APP_STATE.stockDrinks = d;
        APP_STATE.pettyCash = calcTotal;
        APP_STATE.expectedCash = calcTotal;
        APP_STATE.stockActive = true;

        // Reset shift stats
        APP_STATE.shiftSales = {
            total: 0,
            efectivo: 0,
            transfer: 0,
            deliveryFees: 0,
            deliveryEfectivo: 0,
            deliveryTransfer: 0,
            items: {}
        };

        this.updateStockUI();
        document.getElementById('modal-stock').classList.add('hidden');
        alert(`Turno Abierto. Stock: ${s} masas, ${d} bebidas. Caja: Gs. ${calcTotal.toLocaleString()}`);
    },

    requestOpenShift: function () {
        document.getElementById('modal-stock').classList.remove('hidden');
        document.getElementById('opening-fields').classList.remove('hidden');
        document.getElementById('diff-container').classList.add('hidden');
        document.getElementById('bills-body').closest('div').parentElement.style.display = 'grid'; // ensure 2 cols or grid
    },

    requestCloseShift: function () {
        document.getElementById('modal-stock').classList.remove('hidden');
        document.getElementById('opening-fields').classList.add('hidden');
        document.getElementById('diff-container').classList.remove('hidden');
        document.getElementById('expected-cash-display').textContent = `Gs. ${APP_STATE.expectedCash.toLocaleString()}`;

        // Reset calculator
        document.querySelectorAll('.cash-calc').forEach(i => i.value = '');
        this.updateDashTotal();

        // Load movements
        this.renderMovementsDashboard();
    },

    saveMovementDashboard: function () {
        const amount = parseInt(document.getElementById('dash-mov-amount').value);
        const desc = document.getElementById('dash-mov-desc').value.trim();
        const type = document.getElementById('dash-mov-type').value;

        if (isNaN(amount) || amount <= 0) return alert("Ingresa un monto válido");
        if (!desc) return alert("La descripción es obligatoria");

        const movement = {
            type: type,
            amount: amount,
            desc: desc,
            timestamp: new Date().toLocaleTimeString(),
            date: new Date().toLocaleDateString(),
            user: APP_STATE.role || "CASHIER"
        };

        firebase.database().ref('movements').push(movement, (error) => {
            if (error) {
                alert("Error: " + error.message);
            } else {
                // Update local state and expected cash
                if (type === 'ingreso') {
                    APP_STATE.expectedCash += amount;
                    APP_STATE.pettyCash += amount;
                } else {
                    APP_STATE.expectedCash -= amount;
                    APP_STATE.pettyCash -= amount;
                }
                document.getElementById('expected-cash-display').textContent = `Gs. ${APP_STATE.expectedCash.toLocaleString()}`;
                document.getElementById('dash-mov-amount').value = '';
                document.getElementById('dash-mov-desc').value = '';
                this.renderMovementsDashboard();
                this.updateDashTotal(); // Re-calc diff
            }
        });
    },

    renderMovementsDashboard: function () {
        const container = document.getElementById('dash-mov-list');
        const summary = document.getElementById('dash-mov-summary');
        const todayStr = new Date().toLocaleDateString();

        firebase.database().ref('movements').once('value', snap => {
            let html = '';
            let totalIn = 0;
            let totalOut = 0;

            snap.forEach(child => {
                const m = child.val();
                const key = child.key;

                if (m.date === todayStr) {
                    if (m.type === 'ingreso') totalIn += m.amount;
                    else totalOut += m.amount;

                    const safeDesc = app.escapeHtml(m.desc);
                    const safeTime = app.escapeHtml(m.timestamp);

                    html += `
                        <div class="dash-mov-item">
                            <div style="flex:1">
                                <small style="display:block; color:#666">${safeTime}</small>
                                <span>${safeDesc}</span>
                            </div>
                            <div style="text-align:right">
                                <span style="color:${m.type === 'ingreso' ? '#4caf50' : '#f44336'}">
                                    ${m.type === 'ingreso' ? '+' : '-'} ${m.amount.toLocaleString()}
                                </span>
                                <button class="btn-mov-delete"
                                    data-key="${app.escapeHtml(key)}"
                                    data-type="${app.escapeHtml(m.type)}"
                                    data-amount="${m.amount}"
                                    onclick="app.deleteMovement(this.dataset.key, this.dataset.type, Number(this.dataset.amount))">×</button>
                            </div>
                        </div>
                    `;
                }
            });

            container.innerHTML = html || '<p style="text-align:center; color:#555; padding:20px;">Sin movimientos hoy</p>';
            summary.innerHTML = `Ing: ${totalIn.toLocaleString()} | Eg: ${totalOut.toLocaleString()} | Saldo: ${(totalIn - totalOut).toLocaleString()} Gs`;
        });
    },

    deleteMovement: function (key, type, amount) {
        if (!confirm("¿Eliminar este movimiento?")) return;

        firebase.database().ref('movements').child(key).remove((error) => {
            if (error) {
                alert("Error al eliminar: " + error.message);
            } else {
                // Reverse the effect on expected cash
                if (type === 'ingreso') {
                    APP_STATE.expectedCash -= amount;
                    APP_STATE.pettyCash -= amount;
                } else {
                    APP_STATE.expectedCash += amount;
                    APP_STATE.pettyCash += amount;
                }
                document.getElementById('expected-cash-display').textContent = `Gs. ${APP_STATE.expectedCash.toLocaleString()}`;
                this.renderMovementsDashboard();
                this.updateDashTotal(); // Re-calc diff
            }
        });
    },

    cancelClose: function () {
        document.getElementById('modal-stock').classList.add('hidden');
    },

    closeShift: function () {
        const counted = APP_STATE._currentCalcTotal || 0;
        const expected = APP_STATE.expectedCash;

        // Validation: Ensure total contado is not "Gs. 0" if expected is > 0 OR at least some input was touched
        const anyInput = Array.from(document.querySelectorAll('.cash-calc')).some(i => i.value !== '');
        if (!anyInput && expected > 0) {
            return alert("Debes realizar el conteo de billetes para cerrar la caja.");
        }

        const todayStr = new Date().toLocaleDateString();
        firebase.database().ref('movements').once('value', snap => {
            const movs = [];
            let totalIn = 0;
            let totalOut = 0;
            snap.forEach(c => {
                const m = c.val();
                if (m.date === todayStr) {
                    movs.push(m);
                    if (m.type === 'ingreso') totalIn += m.amount;
                    else totalOut += m.amount;
                }
            });

            const report = `INFORME DE CIERRE DE CAJA\n` +
                `=================================\n` +
                `Fecha: ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}\n` +
                `---------------------------------\n` +
                `Apertura (Dotación): Gs. ${APP_STATE.pettyCash.toLocaleString()}\n` +
                `Ventas Efectivo:     Gs. ${APP_STATE.shiftSales.efectivo.toLocaleString()}\n` +
                `Ventas Transfer:     Gs. ${APP_STATE.shiftSales.transfer.toLocaleString()}\n` +
                `---------------------------------\n` +
                `Suma Ventas + Dot:   Gs. ${(APP_STATE.shiftSales.efectivo + APP_STATE.pettyCash).toLocaleString()}\n` +
                `Ingresos Extra:      Gs. ${totalIn.toLocaleString()}\n` +
                `Egresos/Gastos:      Gs. ${totalOut.toLocaleString()}\n` +
                `---------------------------------\n` +
                `EFECTIVO ESPERADO:   Gs. ${expected.toLocaleString()}\n` +
                `EFECTIVO CONTADO:    Gs. ${counted.toLocaleString()}\n` +
                `DIFERENCIA:          Gs. ${(counted - expected).toLocaleString()}\n` +
                `=================================\n\n` +
                `DETALLE DELIVERY:\n` +
                `- Total Delivery:    Gs. ${APP_STATE.shiftSales.deliveryFees.toLocaleString()}\n` +
                `- En Efectivo:       Gs. ${APP_STATE.shiftSales.deliveryEfectivo.toLocaleString()}\n` +
                `- Por Transferencia: Gs. ${APP_STATE.shiftSales.deliveryTransfer.toLocaleString()}\n\n` +
                `MOVIMIENTOS DE CAJA:\n` +
                (movs.length > 0 ?
                    movs.map(m => `[${m.type.toUpperCase()}] ${m.desc}: Gs. ${m.amount.toLocaleString()}`).join('\n') : "Sin movimientos registrados") +
                `\n\nDETALLE DE PRODUCTOS VENDIDOS:\n` +
                Object.entries(APP_STATE.shiftSales.items).map(([name, count]) => `- ${name}: ${count}`).join('\n');

            // Download report
            const blob = new Blob([report], { type: 'text/plain' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            const safeDate = new Date().toISOString().split('T')[0];
            link.download = `Cierre_Caja_${safeDate}.txt`;
            link.click();
            alert("Turno Cerrado. El informe se ha descargado.");
            location.reload();
        });
    },

    // --- SERVICE ROLE LOGIC ---
    initServiceView: function () {
        document.getElementById('service-buttons').classList.remove('hidden');
        document.getElementById('service-form').classList.add('hidden');
        document.getElementById('mov-amount').value = '';
        document.getElementById('mov-desc').value = '';
    },

    openMovementForm: function (type) {
        APP_STATE._currentMovType = type; // 'ingreso' or 'egreso'
        document.getElementById('service-buttons').classList.add('hidden');
        document.getElementById('service-form').classList.remove('hidden');
        document.getElementById('mov-title').textContent = type.toUpperCase();
        document.getElementById('mov-title').style.color = type === 'ingreso' ? 'var(--success)' : '#d32f2f';
    },

    saveMovement: function () {
        const amount = parseInt(document.getElementById('mov-amount').value);
        const desc = document.getElementById('mov-desc').value.trim();

        if (isNaN(amount) || amount <= 0) return alert("Ingresa un monto válido");
        if (!desc) return alert("La descripción es obligatoria");

        const movement = {
            type: APP_STATE._currentMovType,
            amount: amount,
            desc: desc,
            timestamp: new Date().toLocaleTimeString(),
            date: new Date().toLocaleDateString(),
            user: "SERVICIO"
        };

        firebase.database().ref('movements').push(movement, (error) => {
            if (error) {
                alert("Error al guardar: " + error.message);
            } else {
                alert("Movimiento registrado correctamente");
                this.initServiceView();
            }
        });
    },

    updateStockUI: function () {
        const stockEl = document.getElementById('stock-display');
        stockEl.textContent = APP_STATE.stock;

        // Low stock alert for Masas
        if (APP_STATE.stock <= 5) {
            stockEl.style.color = '#f44336';
            stockEl.style.fontWeight = 'bold';
        } else {
            stockEl.style.color = '';
            stockEl.style.fontWeight = '';
        }

        // Drink stock display
        const drinkStockEl = document.getElementById('stock-drinks-display');
        if (drinkStockEl) {
            drinkStockEl.textContent = APP_STATE.stockDrinks;
            if (APP_STATE.stockDrinks <= 3) {
                drinkStockEl.style.color = '#f44336';
            } else {
                drinkStockEl.style.color = '#2196f3';
            }
        }

        document.getElementById('petty-cash-display').textContent = `Gs. ${APP_STATE.pettyCash.toLocaleString()}`;
    },

    // --- CLIENT MANAGEMENT ---
    fetchClients: function () {
        firebase.database().ref('clients').on('value', snap => {
            const data = snap.val();
            APP_STATE.clients = data ? Object.values(data) : [];
        });
    },

    searchClients: function (query) {
        const container = document.getElementById('client-suggestions');
        if (!query || query.length < 2) {
            container.classList.add('hidden');
            return;
        }

        const matches = APP_STATE.clients.filter(c =>
            c.name.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);

        if (matches.length === 0) {
            container.classList.add('hidden');
            return;
        }

        container.innerHTML = matches.map(c => `
            <div style="padding: 10px; cursor: pointer; border-bottom: 1px solid #333;" 
                 data-name="${app.escapeHtml(c.name)}"
                 onclick="app.selectClient(this.dataset.name)">${app.escapeHtml(c.name)}</div>
        `).join('');
        container.classList.remove('hidden');
    },

    selectClient: function (name) {
        document.getElementById('customer-name').value = name;
        document.getElementById('client-suggestions').classList.add('hidden');
    },

    setOcasional: function () {
        document.getElementById('customer-name').value = 'Ocasional';
        document.getElementById('client-suggestions').classList.add('hidden');
    },

    addClient: function () {
        const name = prompt("Nombre del nuevo cliente:");
        if (!name || name.trim() === '') return;

        firebase.database().ref('clients').push({ name: name.trim() });
        document.getElementById('customer-name').value = name.trim();
        alert("Cliente agregado: " + name.trim());
        this.renderClients();
    },

    renderClients: function () {
        const list = document.getElementById('clients-list');
        const query = document.getElementById('client-search-input').value.toLowerCase();

        const filtered = APP_STATE.clients.filter(c => c.name.toLowerCase().includes(query));

        list.innerHTML = filtered.map(c => `
            <div class="stats-card" style="padding: 15px; border-left: 4px solid var(--primary-gold);">
                <div style="font-weight: bold; font-size: 1.1rem; margin-bottom: 5px;">${app.escapeHtml(c.name)}</div>
                <div style="display: flex; gap: 10px;">
                    <button class="btn btn-gold" style="padding: 5px 10px; font-size: 0.8rem;"
                        data-name="${app.escapeHtml(c.name)}"
                        onclick="app.selectClient(this.dataset.name); app.switchTab('order')">SELECCIONAR</button>
                    <button class="btn" style="padding: 5px 10px; font-size: 0.8rem; background: #333;"
                        data-name="${app.escapeHtml(c.name)}"
                        onclick="app.deleteClient(this.dataset.name)">ELIMINAR</button>
                </div>
            </div>
        `).join('');
    },

    deleteClient: function (name) {
        if (!confirm(`¿Eliminar a ${name}?`)) return;
        // In this implementation names are unique enough or we could find key
        firebase.database().ref('clients').orderByChild('name').equalTo(name).once('value', snap => {
            snap.forEach(child => child.ref.remove());
        });
    },

    toggleDeliveryFee: function () {
        const type = document.getElementById('order-type').value;
        const container = document.getElementById('delivery-fee-container');
        if (type === 'Delivery') {
            container.classList.remove('hidden');
        } else {
            container.classList.add('hidden');
            document.getElementById('delivery-fee').value = '';
        }
    },

    // --- ADMIN STATISTICS ---
    loadAdminStats: function () {
        APP_STATE.dbRef.once('value', snap => {
            const today = new Date();
            const todayStr = today.toLocaleDateString();
            const currentMonth = today.getMonth();
            const currentYear = today.getFullYear();

            let cashEfectivo = 0;
            let cashTransfer = 0;
            let pizzaCountDay = 0, pizzaCountMonth = 0, pizzaCountYear = 0;
            let drinkCountDay = 0, drinkCountMonth = 0, drinkCountYear = 0;

            snap.forEach(c => {
                const o = c.val();
                if (!o.date || !o.items) return;

                // Parse order date
                const [d, m, y] = o.date.split('/');
                const orderDate = new Date(y, m - 1, d);
                const isToday = o.date === todayStr;
                const isThisMonth = orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
                const isThisYear = orderDate.getFullYear() === currentYear;

                // Only count paid orders
                if (o.payStatus !== 'paid') return;

                // Today's cash
                if (isToday) {
                    if (o.method === 'Efectivo') cashEfectivo += (o.total || 0);
                    else cashTransfer += (o.total || 0);
                }

                // Count items
                o.items.forEach(item => {
                    if (item.type === 'pizza') {
                        if (isToday) pizzaCountDay++;
                        if (isThisMonth) pizzaCountMonth++;
                        if (isThisYear) pizzaCountYear++;
                    } else if (item.type === 'drink') {
                        if (isToday) drinkCountDay++;
                        if (isThisMonth) drinkCountMonth++;
                        if (isThisYear) drinkCountYear++;
                    }
                });
            });

            // Update UI - Cash
            document.getElementById('admin-cash-efectivo').textContent = `Gs. ${cashEfectivo.toLocaleString()}`;
            document.getElementById('admin-cash-transfer').textContent = `Gs. ${cashTransfer.toLocaleString()}`;
            document.getElementById('admin-cash-total').textContent = `Gs. ${(cashEfectivo + cashTransfer).toLocaleString()}`;

            // Update UI - Pizza count based on selector
            const pizzaPeriod = document.getElementById('admin-pizza-period').value;
            let pizzaDisplay = pizzaPeriod === 'day' ? pizzaCountDay : (pizzaPeriod === 'month' ? pizzaCountMonth : pizzaCountYear);
            document.getElementById('admin-pizza-count').textContent = pizzaDisplay;

            // Update UI - Drink count based on selector
            const drinkPeriod = document.getElementById('admin-drink-period').value;
            let drinkDisplay = drinkPeriod === 'day' ? drinkCountDay : (drinkPeriod === 'month' ? drinkCountMonth : drinkCountYear);
            document.getElementById('admin-drink-count').textContent = drinkDisplay;
        });
    },

    // --- ADMIN TABS NAVIGATION ---
    switchAdminTab: function (tabName) {
        // Hide all admin tab contents
        document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.add('hidden'));

        // Show selected tab
        document.getElementById('admin-content-' + tabName).classList.remove('hidden');

        // Update tab button styles
        document.getElementById('admin-tab-productos').style.background = '#333';
        document.getElementById('admin-tab-productos').style.color = 'white';
        document.getElementById('admin-tab-productos').style.fontWeight = 'normal';

        document.getElementById('admin-tab-stats').style.background = '#333';
        document.getElementById('admin-tab-stats').style.color = 'white';
        document.getElementById('admin-tab-stats').style.fontWeight = 'normal';

        document.getElementById('admin-tab-reportes').style.background = '#333';
        document.getElementById('admin-tab-reportes').style.color = 'white';
        document.getElementById('admin-tab-reportes').style.fontWeight = 'normal';

        // Highlight active tab
        const activeTab = document.getElementById('admin-tab-' + tabName);
        activeTab.style.background = 'var(--primary-gold)';
        activeTab.style.color = 'black';
        activeTab.style.fontWeight = 'bold';

        // Load stats when switching to stats tab
        if (tabName === 'stats') this.loadAdminStats();
    },

    // --- HELPER: Format Guaraníes ---
    formatGs: function (num) {
        return 'Gs. ' + num.toLocaleString('es-PY');
    },

    switchTab: function (tabName) {
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        if (event) event.target.classList.add('active');

        document.getElementById('tab-order').classList.add('hidden');
        document.getElementById('tab-sent').classList.add('hidden');
        document.getElementById('tab-clients').classList.add('hidden');
        document.getElementById('tab-history').classList.add('hidden');

        document.getElementById('tab-' + tabName).classList.remove('hidden');

        if (tabName === 'sent') this.renderSentOrders();
        if (tabName === 'clients') this.renderClients();
    },

    // --- BUILDER LOGIC ---
    renderFlavors: function () {
        // Pizzas
        const pContainer = document.getElementById('flavors-container');
        if (pContainer) {
            if (APP_STATE.products.flavors.length === 0) {
                pContainer.innerHTML = '<p style="color:#666; text-align:center;">Cargando sabores...</p>';
            } else {
                pContainer.innerHTML = APP_STATE.products.flavors.map(f => `
                    <div class="flavor-card" id="card-${app.escapeHtml(f.id)}" data-id="${app.escapeHtml(f.id)}" onclick="app.selectFlavor(this.dataset.id)">
                        <div class="flavor-img" ${f.img ? `style="background-image: url('${app.escapeHtml(f.img)}'); background-size: cover;"` : ''}></div>
                        <span style="font-weight: bold; color: #dac0a3;">${app.escapeHtml(f.name)}</span>
                        ${f.ingredients ? `<p style="color: #bbb; font-size: 0.65rem; margin: 4px 0; line-height: 1.2;">${app.escapeHtml(f.ingredients)}</p>` : ''}
                        <span style="display:block; margin-top:5px; color: var(--primary-gold); font-size: 0.9rem;">Gs. ${(parseInt(f.price) || 0).toLocaleString('es-PY')}</span>
                    </div>
                `).join('');
            }
        }

        // Drinks
        const dContainer = document.getElementById('drinks-container');
        if (dContainer) {
            dContainer.innerHTML = APP_STATE.products.drinks.map(d => `
                <div class="flavor-card" data-id="${app.escapeHtml(d.id)}" onclick="app.addDrink(this.dataset.id)">
                        <div class="flavor-img" style="border-radius:0; background:none; font-size:2rem; ${d.img ? `background-image: url('${app.escapeHtml(d.img)}'); background-size: contain; background-repeat: no-repeat; background-position: center; border:none;` : ''}">${d.img ? '' : '🥤'}</div>
                    <span style="font-weight: bold; font-size: 0.9rem;">${app.escapeHtml(d.name)}</span>
                    <span style="color: var(--primary-gold);">Gs. ${d.price.toLocaleString()}</span>
                </div>
            `).join('');
        }
    },

    setPizzaMode: function (mode) {
        APP_STATE.pizzaMode = mode;
        APP_STATE.selectedFlavors = []; // reset selection

        // UI Toggle
        document.getElementById('sw-full').classList.toggle('active', mode === 'full');
        document.getElementById('sw-half').classList.toggle('active', mode === 'half');

        // Text
        const txt = mode === 'full' ? "Selecciona 1 sabor" : "Selecciona 2 sabores";
        document.getElementById('selection-instruction').textContent = txt;

        // Clear selection visual
        document.querySelectorAll('.flavor-card').forEach(c => c.classList.remove('selected'));
    },

    selectFlavor: function (id) {
        const card = document.getElementById(`card-${id}`);
        const max = APP_STATE.pizzaMode === 'full' ? 1 : 2;

        // Toggle logic
        if (APP_STATE.selectedFlavors.includes(id)) {
            APP_STATE.selectedFlavors = APP_STATE.selectedFlavors.filter(fid => fid !== id);
            card.classList.remove('selected');
        } else {
            if (APP_STATE.selectedFlavors.length >= max) {
                if (max === 1) {
                    // Clear all
                    APP_STATE.selectedFlavors = [];
                    document.querySelectorAll('.flavor-card').forEach(c => c.classList.remove('selected'));
                } else {
                    return; // Don't allow more than 2
                }
            }
            APP_STATE.selectedFlavors.push(id);
            card.classList.add('selected');
        }
    },

    addDrink: function (id) {
        const item = APP_STATE.products.drinks.find(d => d.id === id);
        const notes = document.getElementById('item-notes').value;
        APP_STATE.cart.push({
            type: 'drink',
            name: item.name,
            price: item.price,
            notes: notes
        });
        document.getElementById('item-notes').value = '';
        this.renderCart();
    },

    addToCart: function () {
        // Check pizza selection
        const needed = APP_STATE.pizzaMode === 'full' ? 1 : 2;
        if (APP_STATE.selectedFlavors.length !== needed) {
            return alert(`Por favor selecciona ${needed} sabor(es).`);
        }

        // Calculate price
        // Use dynamic products list
        const selectedObjs = APP_STATE.selectedFlavors.map(fid => APP_STATE.products.flavors.find(f => f.id === fid));
        const price = Math.max(...selectedObjs.map(f => f.price));

        const names = selectedObjs.map(f => f.name).join(' / ');
        const notes = document.getElementById('item-notes').value;

        APP_STATE.cart.push({
            type: 'pizza',
            name: `Pizza ${APP_STATE.pizzaMode === 'half' ? 'Mitad' : ''}: ${names}`,
            price: price,
            notes: notes
        });

        // Reset inputs
        APP_STATE.selectedFlavors = [];
        document.querySelectorAll('.flavor-card').forEach(c => c.classList.remove('selected'));
        document.getElementById('item-notes').value = '';
        this.renderCart();
    },

    removeFromCart: function (idx) {
        APP_STATE.cart.splice(idx, 1);
        this.renderCart();
    },

    renderCart: function () {
        const c = document.getElementById('cart-container');
        let total = 0;
        c.innerHTML = APP_STATE.cart.map((item, i) => {
            total += item.price;
            return `
            <div class="cart-item">
                <div class="cart-item-title">${app.escapeHtml(item.name)}</div>
                <div class="cart-item-desc">${app.escapeHtml(item.notes) || ''}</div>
                <div style="text-align: right; color: #fff;">Gs. ${item.price.toLocaleString()}</div>
                <button class="btn-remove" onclick="app.removeFromCart(${i})">&times;</button>
            </div>`;
        }).join('');
        document.getElementById('cart-total').textContent = `Gs. ${total.toLocaleString()}`;
        this.calculateChange(); // Update change display
    },

    calculateChange: function () {
        const totalText = document.getElementById('cart-total').textContent;
        const total = parseInt(totalText.replace(/\D/g, '')) || 0;
        const payAmount = parseInt(document.getElementById('pay-amount').value) || 0;
        const change = payAmount - total;

        const changeEl = document.getElementById('change-amount');
        if (change >= 0) {
            changeEl.textContent = `Gs. ${change.toLocaleString()}`;
            changeEl.style.color = 'var(--success)';
        } else {
            changeEl.textContent = `Gs. 0`;
            changeEl.style.color = '#888';
        }
    },

    sendOrder: function (payStatus) {
        if (!APP_STATE.stockActive) return alert("Primero debes realizar la Apertura de Turno");
        if (APP_STATE.cart.length === 0) return alert("Carrito vacío");

        const customerName = document.getElementById('customer-name').value;
        if (!customerName) return alert("Por favor ingresa el Nombre del Cliente");

        const orderType = document.getElementById('order-type').value;
        const deliveryFee = orderType === 'Delivery' ? (parseInt(document.getElementById('delivery-fee').value) || 0) : 0;
        const paymentMethod = document.getElementById('payment-method').value;

        const isEditing = APP_STATE._editingOrderKey !== null;
        const editingOrder = isEditing ? APP_STATE.ordersCache.find(o => o.key === APP_STATE._editingOrderKey) : null;

        // Stock deduction logic for NEW orders only (if editing, we handle it differently based on status)
        let itemsToSend = [...APP_STATE.cart];

        if (isEditing && editingOrder.status === 'ready') {
            // Compare items to find only new ones
            // Simple logic: if editing a ready order, treat all items in cart NOT in original order as new
            // Efficient way: filter cart items that were not present in editingOrder.items
            // Limitation: if someone adds exactly the same pizza, it might be tricky. 
            // Better: If 'ready', everything in the cart that wasn't already 'ready' is sent as new.
            // But let's simplify: User wants "un nuevo pedido, sin la descripcion de las demas pizzas que ya terminó"
            itemsToSend = APP_STATE.cart.filter(newItem =>
                !editingOrder.items.some(oldItem => oldItem.id === newItem.id)
            );
            if (itemsToSend.length === 0) return alert("No hay productos nuevos para enviar.");
        }

        const pizzasCount = itemsToSend.filter(i => i.type === 'pizza').length;
        const drinksCount = itemsToSend.filter(i => i.type === 'drink').length;

        if (pizzasCount > APP_STATE.stock) return alert("¡No hay suficiente stock de Masas!");
        if (drinksCount > APP_STATE.stockDrinks) return alert("¡No hay suficiente stock de Bebidas!");

        APP_STATE.stock -= pizzasCount;
        APP_STATE.stockDrinks -= drinksCount;
        this.updateStockUI();

        const self = this;
        this.getNextId(function (seqId) {
            const newOrder = {
                id: isEditing ? (editingOrder.status === 'ready' ? `${editingOrder.id}-B` : editingOrder.id) : seqId,
                customer: customerName,
                items: isEditing && editingOrder.status === 'cooking' ? APP_STATE.cart : itemsToSend,
                total: (isEditing && editingOrder.status === 'cooking' ? APP_STATE.cart : itemsToSend).reduce((sum, i) => sum + i.price, 0),
                deliveryFee: deliveryFee,
                type: orderType,
                method: paymentMethod,
                payStatus: payStatus,
                status: 'cooking',
                timestamp: new Date().toLocaleTimeString(),
                date: new Date().toLocaleDateString()
            };

            // IF EDITING & COOKING -> UPDATE ORIGINAL
            if (isEditing && editingOrder.status === 'cooking') {
                APP_STATE.dbRef.child(APP_STATE._editingOrderKey).update({
                    items: APP_STATE.cart,
                    total: newOrder.total,
                    deliveryFee: deliveryFee,
                    type: orderType,
                    method: paymentMethod,
                    payStatus: payStatus
                }, (err) => {
                    if (!err) {
                        alert("Pedido Actualizado");
                        self.resetCart();
                    }
                });
                return;
            }

            // TRACK SHIFT STATS (If new or new sub-order)
            if (payStatus === 'paid') {
                APP_STATE.shiftSales.total += newOrder.total;
                APP_STATE.shiftSales.deliveryFees += deliveryFee;

                if (newOrder.method === 'Efectivo') {
                    APP_STATE.shiftSales.efectivo += newOrder.total + deliveryFee;
                    APP_STATE.shiftSales.deliveryEfectivo += deliveryFee;
                    APP_STATE.expectedCash += newOrder.total + deliveryFee;
                } else {
                    APP_STATE.shiftSales.transfer += newOrder.total + deliveryFee;
                    APP_STATE.shiftSales.deliveryTransfer += deliveryFee;
                }

                newOrder.items.forEach(i => {
                    APP_STATE.shiftSales.items[i.name] = (APP_STATE.shiftSales.items[i.name] || 0) + 1;
                });
            }

            // Push to Firebase
            APP_STATE.dbRef.push(newOrder, function (error) {
                if (error) {
                    alert("Error al enviar: " + error.message);
                } else {
                    alert(`Pedido Enviado (${payStatus === 'paid' ? 'PAGADO' : 'PENDIENTE'})`);

                    // AUTO-SAVE CLIENT IF NEW
                    const isNew = !APP_STATE.clients.some(c => c.name.toLowerCase() === customerName.toLowerCase());
                    const isNotOcasional = customerName.toLowerCase() !== 'ocasional';
                    if (isNew && isNotOcasional) {
                        firebase.database().ref('clients').push({ name: customerName });
                    }

                    self.resetCart();
                }
            });
        });
    },

    resetCart: function () {
        APP_STATE.cart = [];
        APP_STATE._editingOrderKey = null;
        document.getElementById('customer-name').value = '';
        document.getElementById('delivery-fee').value = '';
        document.getElementById('pay-amount').value = '';
        document.getElementById('delivery-fee-container').classList.add('hidden');
        this.renderCart();
    },

    // --- LISTENING & RENDERING (GENERIC) ---
    // We listen to ALL orders and filter in memory, like the template did for kitchen
    listenOrdersGeneric: function () {
        APP_STATE.dbRef.limitToLast(50).on('value', (snapshot) => {
            const data = snapshot.val();
            if (!data) {
                APP_STATE.ordersCache = [];
                return;
            }

            const orders = Object.entries(data).map(([key, value]) => ({ key, ...value }));
            APP_STATE.ordersCache = orders; // Store for local filtering

            // Re-render views if they are visible
            if (!document.getElementById('view-chef').classList.contains('hidden')) {
                this.renderChef();
            }
            if (!document.getElementById('tab-sent').classList.contains('hidden')) {
                this.renderSentOrders();
            }

            // Calc daily total for history
            const today = new Date().toLocaleDateString();
            const total = orders
                .filter(o => o.date === today && o.payStatus === 'paid')
                .reduce((sum, o) => sum + (o.total || 0), 0);

            const dailyEl = document.getElementById('daily-total');
            if (dailyEl) dailyEl.textContent = `Gs. ${total.toLocaleString()}`;
        });
    },

    renderSentOrders: function () {
        if (!APP_STATE.ordersCache) return;
        const list = document.getElementById('sent-orders-list');
        list.innerHTML = "";

        // Sort: unpaid (cooking) first, then by recency
        const sorted = [...APP_STATE.ordersCache]
            .filter(o => o.status !== 'cancelled')
            .sort((a, b) => {
                if (a.payStatus === 'pending' && b.payStatus === 'paid') return -1;
                if (a.payStatus === 'paid' && b.payStatus === 'pending') return 1;
                return 0; // maintain relative recency within groups if cache is already sorted or use keys
            })
            .reverse() // Most recent first within groups
            .slice(0, 15);

        sorted.forEach(o => {
            const canCancel = o.status === 'cooking';
            const canEdit = o.payStatus === 'pending';

            list.innerHTML += `
                <div class="ticket" style="width: 280px; border-color: ${o.payStatus === 'paid' ? 'var(--success)' : 'var(--pending)'}; position: relative;">
                    ${o.payStatus === 'pending' ? '<div style="position: absolute; top: -10px; right: -10px; background: var(--pending); color: black; font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; font-weight: bold;">PENDIENTE</div>' : ''}
                    <div class="ticket-header">#${app.escapeHtml(o.id)} - ${app.escapeHtml(o.customer) || 'S/N'}</div>
                    <div class="ticket-body">
                        Total: Gs. ${(o.total || 0).toLocaleString()}${o.deliveryFee ? ` (+Gs. ${o.deliveryFee.toLocaleString()} Delivery)` : ''}<br>
                        Estado: ${o.status === 'cooking' ? 'COCINANDO' : (o.status === 'ready' ? 'LISTO' : o.status)}<br>
                        Pago: <b>${o.payStatus === 'paid' ? 'PAGADO' : 'PENDIENTE'}</b>
                    </div>
                    <div class="ticket-footer" style="display: flex; gap: 5px; flex-wrap: wrap;">
                        ${o.payStatus === 'pending' ? `<button class="btn btn-gold" style="flex:1; min-width: 80px;" onclick="app.markPaid('${o.key}')">COBRAR</button>` : ''}
                        ${canEdit ? `<button class="btn" style="flex:1; min-width: 80px; background: #2196f3; color: white;" onclick="app.editOrder('${o.key}')">EDITAR</button>` : ''}
                        ${canCancel ? `<button class="btn" style="flex:1; min-width: 80px; background: #d32f2f; color: white;" onclick="app.cancelOrder('${o.key}')">ANULAR</button>` : ''}
                    </div>
                </div>
            `;
        });
    },

    markPaid: function (key) {
        const order = APP_STATE.ordersCache.find(o => o.key === key);
        if (order && order.payStatus === 'pending') {
            // Update shift stats
            APP_STATE.shiftSales.total += (order.total || 0);
            APP_STATE.shiftSales.deliveryFees += (order.deliveryFee || 0);
            if (order.method === 'Efectivo') {
                APP_STATE.shiftSales.efectivo += (order.total || 0) + (order.deliveryFee || 0);
                APP_STATE.expectedCash += (order.total || 0) + (order.deliveryFee || 0);
            } else {
                APP_STATE.shiftSales.transfer += (order.total || 0) + (order.deliveryFee || 0);
            }
            // Add items to stats
            if (order.items && Array.isArray(order.items)) {
                order.items.forEach(i => {
                    APP_STATE.shiftSales.items[i.name] = (APP_STATE.shiftSales.items[i.name] || 0) + 1;
                });
            }
            // Update Firebase
            APP_STATE.dbRef.child(key).update({ payStatus: 'paid' });
            alert("Pedido marcado como COBRADO");
        }
    },

    editOrder: function (key) {
        const order = APP_STATE.ordersCache.find(o => o.key === key);
        if (!order) return;

        if (order.payStatus === 'paid') return alert("No se puede editar un pedido ya pagado.");

        APP_STATE.cart = [...order.items];
        APP_STATE._editingOrderKey = key;

        document.getElementById('customer-name').value = order.customer || '';
        document.getElementById('order-type').value = order.type || 'Local';
        document.getElementById('payment-method').value = order.method || 'Efectivo';

        if (order.type === 'Delivery') {
            document.getElementById('delivery-fee-container').classList.remove('hidden');
            document.getElementById('delivery-fee').value = order.deliveryFee || '';
        }

        this.switchTab('order');
        this.renderCart();
        alert(`Editando Pedido #${order.id}`);
    },

    cancelOrder: function (key) {
        const order = APP_STATE.ordersCache.find(o => o.key === key);
        if (!order) return;

        if (!confirm(`¿Estás seguro de ANULAR el pedido #${order.id}?`)) return;

        // Restore pizza stock
        const pizzasCount = order.items.filter(i => i.type === 'pizza').length;
        APP_STATE.stock += pizzasCount;

        // Restore drink stock
        const drinksCount = order.items.filter(i => i.type === 'drink').length;
        APP_STATE.stockDrinks += drinksCount;

        this.updateStockUI();

        // Reverse shift stats if order was paid
        if (order.payStatus === 'paid') {
            APP_STATE.shiftSales.total -= (order.total || 0);
            APP_STATE.shiftSales.deliveryFees -= (order.deliveryFee || 0);
            if (order.method === 'Efectivo') {
                APP_STATE.shiftSales.efectivo -= ((order.total || 0) + (order.deliveryFee || 0));
                APP_STATE.expectedCash -= ((order.total || 0) + (order.deliveryFee || 0));
            } else {
                APP_STATE.shiftSales.transfer -= ((order.total || 0) + (order.deliveryFee || 0));
            }
        }

        // Mark as cancelled in Firebase
        APP_STATE.dbRef.child(key).update({ status: 'cancelled' });
        alert("Pedido ANULADO. Stock restaurado.");
    },

    // --- CHEF LOGIC ---
    listenChef: function () {
        this.listenOrdersGeneric();
    },

    renderChef: function () {
        const container = document.getElementById('chef-board');
        if (!APP_STATE.ordersCache || APP_STATE.ordersCache.length === 0) {
            container.innerHTML = "<h3 style='grid-column: 1/-1; text-align:center; color:#555;'>No hay pedidos registrados</h3>";
            return;
        }

        // Filter in memory for 'cooking' OR 'ready' (to allow UNDO)
        const cooking = APP_STATE.ordersCache.filter(o => o.status === 'cooking');
        const readyRecent = APP_STATE.ordersCache.filter(o => o.status === 'ready').slice(-4); // Show last 4 ready for UNDO

        const ordersToShow = [...cooking, ...readyRecent];

        if (ordersToShow.length === 0) {
            container.innerHTML = "<h3 style='grid-column: 1/-1; text-align:center; color:#555;'>Fila vacía</h3>";
            return;
        }

        container.innerHTML = ordersToShow.reverse().map(o => {
            const isPaid = o.payStatus === 'paid';
            const isLocal = o.type === 'Local';
            const isReady = o.status === 'ready';

            let itemsHtml = (o.items || []).map(i => `
                <li>${app.escapeHtml(i.name)} ${i.notes ? `<br><small style='color:#f57c00'>(${app.escapeHtml(i.notes)})</small>` : ''}</li>
            `).join('');

            return `
            <div class="ticket ${isPaid ? 'paid' : 'pending-pay'}" 
                 style="${isReady ? 'opacity: 0.5; transform: scale(0.9);' : ''} ${isLocal ? 'border-left: 8px solid #2196f3;' : ''}">
                <div class="ticket-header" style="${isPaid ? 'background: var(--success); color: white;' : 'background: var(--pending); color: white;'}">
                    <span>#${app.escapeHtml(o.id)} - ${app.escapeHtml(o.customer) || 'S/N'}</span>
                    <span>${app.escapeHtml(o.timestamp)}</span>
                </div>
                <div class="ticket-body">
                    <div style="margin-bottom: 10px; font-weight: bold; color: var(--primary-gold);">
                        ${isLocal ? '📍 CONSUMO EN LOCAL' : (o.type === 'Delivery' ? '🚚 DELIVERY' : '🛍️ RETIRO')}
                    </div>
                    <ul style="list-style: none; padding: 0;">${itemsHtml}</ul>
                </div>
                <div class="ticket-footer">
                    ${isReady
                    ? `<button class="btn btn-outline" style="width:100%; border-color:#888; color:#888;" onclick="app.undoReady('${o.key}')">DESMARCAR (ERROR)</button>`
                    : `<button class="btn btn-gold" style="width:100%" onclick="app.orderReady('${o.key}')">MARCAR LISTO</button>`
                }
                </div>
            </div>`;
        }).join('');
    },

    undoReady: function (key) {
        APP_STATE.dbRef.child(key).update({ status: 'cooking' });
    },

    orderReady: function (key) {
        APP_STATE.dbRef.child(key).update({ status: 'ready' });
    },

    // --- ADMIN LOGIC ---
    // --- ADMIN LOGIC ---
    // --- ADMIN LOGIC ---
    exportExcel: function (shouldClean = false) {
        const startStr = document.getElementById('admin-date-start').value;
        const endStr = document.getElementById('admin-date-end').value;

        APP_STATE.dbRef.once('value', snap => {
            const data = [];
            const ordersToClean = [];

            snap.forEach(c => {
                const o = c.val();

                let include = true;
                if (startStr || endStr) {
                    try {
                        // FIX: Robust date parsing for "dd/mm/yyyy" or "d/m/yyyy"
                        const [d, m, y] = o.date.split('/');
                        const orderDate = new Date(y, m - 1, d); // Local time
                        orderDate.setHours(0, 0, 0, 0);

                        if (startStr) {
                            const [sy, sm, sd] = startStr.split('-');
                            const sDate = new Date(sy, sm - 1, sd); // Local time
                            sDate.setHours(0, 0, 0, 0);
                            if (orderDate < sDate) include = false;
                        }
                        if (endStr && include) {
                            const [ey, em, ed] = endStr.split('-');
                            const eDate = new Date(ey, em - 1, ed); // Local time
                            eDate.setHours(0, 0, 0, 0);
                            if (orderDate > eDate) include = false;
                        }
                    } catch (e) {
                        // On error, we usually default to include or exclude. 
                        // Let's exclude to avoid garbage data export
                        include = false;
                        console.error("Date parsing error", e);
                    }
                }

                if (include) {
                    ordersToClean.push(c.key);
                    if (o.items && Array.isArray(o.items)) {
                        o.items.forEach(i => {
                            data.push({
                                ID: o.id,
                                Fecha: o.date,
                                Hora: o.timestamp,
                                Tipo: o.type,
                                Pago: o.method,
                                EstadoPago: o.payStatus,
                                Item: i.name,
                                Precio: i.price
                            });
                        });
                    }
                }
            });

            if (data.length === 0) return alert("No hay datos para el rango seleccionado.");

            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Ventas Ore");
            XLSX.writeFile(wb, `Reporte_Ore_${startStr || 'Inicio'}_al_${endStr || 'Fin'}.xlsx`);

            // Only Clean if requested AND confirmed
            if (shouldClean) {
                setTimeout(() => {
                    if (confirm(`⚠️ ATENCIÓN: Has elegido EXTRAER Y LIMPIAR.\n\nSe han exportado ${ordersToClean.length} pedidos.\n\n¿Estás seguro de que deseas ELIMINAR estos registros de la base de datos?`)) {
                        app.cleanOrdersV2(ordersToClean);
                    }
                }, 500);
            }
        });
    },

    cleanOrdersV2: function (keys) {
        if (!keys || keys.length === 0) return;

        let count = 0;
        keys.forEach(k => {
            APP_STATE.dbRef.child(k).remove()
                .then(() => count++)
                .catch(e => console.error(e));
        });

        // Simple feedback (could be improved with Promise.all but this works for basic usage)
        alert(`Operación en proceso: Limpiando ${keys.length} registros...`);
        // Refresh after short delay
        setTimeout(() => location.reload(), 2000);
    }
};

// Auto init
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
