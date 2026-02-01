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
    // --- SHIFT MANAGEMENT (OPEN/CLOSE) ---
    handleShiftAction: function () {
        if (!APP_STATE.stockActive) {
            // Shift is Closed -> OPEN IT
            this.requestOpenShift();
        } else {
            // Shift is Open -> CLOSE IT
            this.requestCloseShift();
        }
    },

    requestOpenShift: function () {
        document.getElementById('modal-stock').classList.remove('hidden');

        // Show Opening Config, Hide Diff/Report
        document.getElementById('opening-fields').classList.remove('hidden');
        document.getElementById('diff-container').classList.add('hidden');
        document.getElementById('arqueo-title').textContent = "Apertura de Caja"; // Need to add ID to title or set text

        // Setup Calculator for "Caja Chica" (Petty Cash)
        // In opening, the calculator is used to count the initial money
        document.getElementById('calc-total-label').textContent = "Caja Chica Total:";

        // Clear inputs
        document.querySelectorAll('.cash-calc').forEach(i => i.value = '');
        document.getElementById('init-stock').value = '';
        document.getElementById('init-stock-drinks').value = '';
        this.updateDashTotal();

        // Hide "Volver" button if strictly opening
        const btnBack = document.getElementById('btn-cancel-opening');
        if (btnBack) btnBack.classList.add('hidden');
    },

    requestCloseShift: async function () {
        document.getElementById('modal-stock').classList.remove('hidden');

        // Hide Opening Config, Show Diff/Report
        document.getElementById('opening-fields').classList.add('hidden');
        document.getElementById('diff-container').classList.remove('hidden');
        document.getElementById('arqueo-title').textContent = "Cierre de Caja";

        // Setup Calculator for "Total in Box"
        document.getElementById('calc-total-label').textContent = "Total en Caja:";

        // Show "Volver" button
        const btnBack = document.getElementById('btn-cancel-opening');
        if (btnBack) btnBack.classList.remove('hidden');

        // Reset calculator (User must count again)
        document.querySelectorAll('.cash-calc').forEach(i => i.value = '');
        this.updateDashTotal();

        // Load stats
        this.renderMovementsDashboard();
        this.updateCloseShiftBreakdown();
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
            this.syncStock(); // Fix: Stock Sync (Vuln 5)
            this.listenShopStatus(); // ✨ NEW: Listen for shift close events

            // Fix: Restore State (Vuln 4)
            this.loadLocalState();

            loader.style.opacity = '0';
            setTimeout(() => loader.classList.add('hidden'), 500);

            this.initCalculator();
            this.initFileInputListener();

            // M3 FIX: Auto-save shift state every 30 seconds
            setInterval(() => this.saveLocalState(), 30000);
        } catch (e) {
            console.error(e);
            this.showToast('Error conectando a DB', 'error');
            loader.classList.add('hidden');
        }
    },

    // --- TOAST NOTIFICATION SYSTEM (M1 FIX) ---
    showToast: function (message, type = 'info') {
        // Remove existing toast
        const existing = document.getElementById('app-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.id = 'app-toast';
        toast.style.cssText = `
            position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
            padding: 12px 24px; border-radius: 8px; z-index: 20000 !important;
            font-weight: bold; animation: fadeIn 0.3s;
            background: ${type === 'error' ? '#d32f2f' : type === 'success' ? '#2e7d32' : '#333'};
            color: white; box-shadow: 0 4px 12px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.2);
        `;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.remove(), 3000);
    },

    // --- SYSTEM EVENTS ---
    listenShopStatus: function () {
        firebase.database().ref('config/shopStatus').on('value', snap => {
            const data = snap.val();
            // Critical Fix: Only trigger feedback if user is currrently logged in
            // This prevents the medal from appearing on the login screen after reload
            if (!APP_STATE.role) return;

            if (data && data.status === 'closed') {
                const now = Date.now();
                // If the event happened in the last 20 seconds, trigger feedback
                if (now - data.timestamp < 20000) {
                    this.triggerGoodJob();
                }
            }
        });
    },

    triggerGoodJob: function () {
        if (!document.getElementById('modal-good-job').classList.contains('hidden')) return;

        document.getElementById('modal-good-job').classList.remove('hidden');

        let seconds = 5;
        const timer = document.getElementById('shutdown-timer');
        const interval = setInterval(() => {
            seconds--;
            if (timer) timer.textContent = seconds;
            if (seconds <= 0) {
                clearInterval(interval);
                localStorage.removeItem('ore_pos_state'); // Ensure clear
                location.reload();
            }
        }, 1000);
    },

    // --- SECURITY & UTILS ---
    escapeHtml: function (text) {
        if (!text) return text;
        return text.toString()
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    },

    hashPin: async function (pin) {
        const msgBuffer = new TextEncoder().encode(pin);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    },

    saveLocalState: function () {
        const stateToSave = {
            stock: APP_STATE.stock, // Fallback local
            stockDrinks: APP_STATE.stockDrinks,
            pettyCash: APP_STATE.pettyCash,
            expectedCash: APP_STATE.expectedCash,
            shiftSales: APP_STATE.shiftSales,
            stockActive: APP_STATE.stockActive,
            date: new Date().toLocaleDateString()
        };
        localStorage.setItem('ore_pos_state', JSON.stringify(stateToSave));
    },

    loadLocalState: function () {
        const saved = localStorage.getItem('ore_pos_state');
        if (saved) {
            const data = JSON.parse(saved);
            // Only restore if it's the same day
            if (data.date === new Date().toLocaleDateString()) {
                APP_STATE.stock = data.stock;
                APP_STATE.stockDrinks = data.stockDrinks;
                APP_STATE.pettyCash = data.pettyCash;
                APP_STATE.expectedCash = data.expectedCash;
                APP_STATE.shiftSales = data.shiftSales;
                APP_STATE.stockActive = data.stockActive;
                console.log("♻️ Estado restaurado del LocalStorage");
                this.updateStockUI();
            } else {
                localStorage.removeItem('ore_pos_state'); // Clear old data
            }
        }
    },

    syncStock: function () {
        // Fix: Real-time stock sync (Vuln 5) + M2 FIX: Multi-device notifications
        firebase.database().ref('stock').on('value', snap => {
            const s = snap.val();
            if (s) {
                const prevStock = APP_STATE.stock;
                APP_STATE.stock = s.masas || 0;
                APP_STATE.stockDrinks = s.drinks || 0;
                this.updateStockUI();
                this.saveLocalState();

                // M2 FIX: Notify if stock changed externally
                if (APP_STATE.role && prevStock !== 0 && prevStock !== APP_STATE.stock) {
                    this.showToast(`📦 Stock actualizado: ${APP_STATE.stock} masas`, 'info');
                }
            }
        });
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
            { id: 'mus', name: 'Mozzarella', price: 40000, cat: 'flavors', img: 'img/pizzas/Muzarella.JPG', ingredients: 'Salsa de tomate, queso mozzarella, orégano, hojas de Albahaca, aceitunas' },
            { id: 'pep', name: 'Pepperoni', price: 45000, cat: 'flavors', img: 'img/pizzas/Pepperoni.png', ingredients: 'Salsa de tomate, queso mozzarella, orégano, pepperoni, aceitunas' },
            { id: 'pal', name: 'Palmito', price: 45000, cat: 'flavors', img: 'img/pizzas/Palmito.jpg', ingredients: 'Salsa de tomate, queso mozzarella, orégano, palmito, salsa golf, aceitunas' },
            { id: 'cat', name: 'Catupiry con pollo', price: 45000, cat: 'flavors', img: 'img/pizzas/Katupyry con pollo (2).jpg', ingredients: 'Salsa de tomate, queso mozzarella, queso catupiry, pollo desmechado, orégano, aceitunas' },
            { id: 'nap', name: 'Napolitana', price: 45000, cat: 'flavors', img: 'img/pizzas/Napolitana.jpg', ingredients: 'Salsa de tomate, queso mozzarella, rodajas de tomate, orégano, jamón en cubitos, ajo, hojas de albahaca, aceitunas' },
            { id: 'cho', name: 'Choclo con catupiry', price: 45000, cat: 'flavors', img: 'img/pizzas/Katupyry con choclo.jpg', ingredients: 'Salsa de tomate, queso mozzarella, queso catupiry, choclo, orégano, aceitunas' },
            { id: 'cip', name: 'La Cipolla', price: 46000, cat: 'flavors', img: 'img/pizzas/La Cipolla 3.JPG', ingredients: 'Salsa de tomate, queso mozzarella, orégano, queso azul, cebolla caramelizada, panceta, aceitunas' },
            { id: 'veg', name: 'Vegetariana', price: 46000, cat: 'flavors', img: 'img/pizzas/Vegetariana 2.JPG', ingredients: 'Salsa de tomate, queso mozzarella, orégano, cherry, choclo, cebolla morada, palmito, locote verde, aceitunas' },
            { id: 'arr', name: 'El Arriero', price: 50000, cat: 'flavors', img: 'img/pizzas/Arriero.jpg', ingredients: 'Salsa de tomate, queso mozzarella, chorizo picante, cebolla morada, locote en julianas, orégano, aceitunas, salsa picante casera' }
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

    // Herramienta de sincronización oficial
    syncMenuPro: function () {
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
                    <td><input type="number" class="cash-calc" data-val="${v}" placeholder="0" aria-label="Cantidad de ${v}" oninput="app.updateDashTotal()"></td>
                    <td id="total-${v}">0</td>
                </tr>
            `).join('');
        }

        if (coinsBody) {
            coinsBody.innerHTML = coins.map(v => `
                <tr>
                    <td>${v.toLocaleString()}</td>
                    <td><input type="number" class="cash-calc" data-val="${v}" placeholder="0" aria-label="Cantidad de ${v}" oninput="app.updateDashTotal()"></td>
                    <td id="total-${v}">0</td>
                </tr>
            `).join('');
        }
    },

    updateDashTotal: function () {
        const expected = APP_STATE.expectedCash;
        let counted = 0;

        document.querySelectorAll('.cash-calc').forEach(i => {
            const val = parseInt(i.dataset.val);
            const count = parseInt(i.value) || 0;
            const rowTotal = count * val;

            // Restore: Update row total display
            const totalCell = document.getElementById(`total-${val}`);
            if (totalCell) totalCell.textContent = rowTotal.toLocaleString();

            counted += rowTotal;
        });

        // Save total for Logic
        APP_STATE._currentCalcTotal = counted;

        document.getElementById('calc-total-display').textContent = `Total Caja: ${counted.toLocaleString()} Gs`;

        const diff = counted - expected;
        const diffEl = document.getElementById('diff-display');
        // const diffLabel = diffEl.previousElementSibling; // The label span

        // Use span for label if parent struct allows, otherwise just update text
        let labelHtml = '';
        let valueColor = '';
        let valueText = '';

        if (diff === 0) {
            labelHtml = 'RESULTADO:';
            valueColor = 'var(--success)';
            valueText = 'PERFECTO (Gs. 0)';
        } else if (diff < 0) {
            labelHtml = 'FALTANTE (Dinero perdido):';
            valueColor = '#f44336';
            valueText = `Gs. ${diff.toLocaleString()}`;
        } else {
            labelHtml = 'SOBRANTE (Dinero extra):';
            valueColor = 'var(--success)';
            valueText = `+ Gs. ${diff.toLocaleString()}`;
        }

        if (diffEl.parentElement) {
            diffEl.parentElement.innerHTML = `<span>${labelHtml}</span><span id="diff-display" style="color:${valueColor}; font-weight:bold;">${valueText}</span>`;
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

        if (!role) return this.showToast('Selecciona un rol', 'error');
        if (!pin) return this.showToast('Ingresa el PIN', 'error');

        // Security: Hashed credentials (no plaintext)
        const HASHES = {
            'cashier': '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4',
            'chef': '9af15b336e6a9619928537df30b2e6a2376569fcf9d7e773eccede65606529a0',
            'admin': '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',
            'service': '0ffe1abd1a08215353c233d6e009613eb95eab46e11d16a63450d90946521172'
        };

        const pinHash = await this.hashPin(pin);

        if (pinHash !== HASHES[role]) {
            return this.showToast('PIN Incorrecto', 'error');
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

            // Rescue State Logic: Check if there are active sales for today
            const stats = await this.getTodayBreakdown();
            if (!APP_STATE.stockActive && stats.total > 0) {
                APP_STATE.stockActive = true;
                APP_STATE.expectedCash = stats.total; // Approximate recovery
                this.showToast("⚠️ Sesión restaurada: Se detectaron ventas activas", "warning");
            }

            // Only request open shift if stock not active (restored state check)
            if (!APP_STATE.stockActive) {
                this.requestOpenShift();
            } else {
                document.getElementById('diff-container').classList.remove('hidden'); // Show standard dash
            }
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

        // Fix: Sync Initial Stock to DB (Vuln 5)
        firebase.database().ref('stock').set({
            masas: s,
            drinks: d
        });

        // Reset shop status to open
        firebase.database().ref('config/shopStatus').set({ status: 'open', timestamp: Date.now() });

        this.updateStockUI();
        this.saveLocalState(); // Fix: Persist state
        document.getElementById('modal-stock').classList.add('hidden');
        alert(`Turno Abierto. Stock sincronizado: ${s} masas, ${d} bebidas.`);
    },

    requestOpenShift: function () {
        document.getElementById('modal-stock').classList.remove('hidden');
        document.getElementById('opening-fields').classList.remove('hidden');
        document.getElementById('diff-container').classList.add('hidden');
        document.getElementById('bills-body').closest('div').parentElement.style.display = 'grid';

        // Hide "Volver a Ventas" during opening to prevent bypass
        const btnBack = document.getElementById('btn-cancel-opening');
        if (btnBack) btnBack.classList.add('hidden');
    },

    requestCloseShift: async function () {
        // Direct close conformation - NO MODAL
        if (confirm("¿Estás seguro de que deseas cerrar el turno y la caja?")) {
            try {
                // 1. Update Shop Status
                await firebase.database().ref('config/shopStatus').set({
                    status: 'closed',
                    timestamp: Date.now(),
                    lastClosedBy: APP_STATE.role
                });

                // 2. Clear Session and Reload
                localStorage.removeItem('ore_pos_state');

                // 3. Show Feedback
                this.showToast("✅ Turno cerrado correctamente", "success");
                setTimeout(() => location.reload(), 1500);
            } catch (e) {
                console.error("Error closing shift:", e);
                alert("Error al cerrar turno: " + e.message);
            }
        }
    },

    updateCloseShiftBreakdown: async function () {
        try {
            const stats = await this.getTodayBreakdown();

            // Defensive null checks to prevent silent failures
            const setPetty = document.getElementById('detail-petty-cash');
            if (setPetty) setPetty.textContent = `Gs. ${APP_STATE.pettyCash.toLocaleString()}`;

            // Use DB Stats for reliability
            const setTotal = document.getElementById('detail-total-sales');
            if (setTotal) setTotal.textContent = `Gs. ${stats.total.toLocaleString()}`;

            const setPizzas = document.getElementById('detail-pizzas');
            if (setPizzas) setPizzas.textContent = `Gs. ${stats.pizza.toLocaleString()}`;

            const setDrinks = document.getElementById('detail-drinks');
            if (setDrinks) setDrinks.textContent = `Gs. ${stats.drink.toLocaleString()}`;

            const setDelivery = document.getElementById('detail-delivery');
            if (setDelivery) setDelivery.textContent = `Gs. ${stats.delivery.toLocaleString()}`;

            // Movements UI
            const setIncome = document.getElementById('detail-income');
            if (setIncome) setIncome.textContent = `Gs. ${stats.movementsIn.toLocaleString()}`;

            const setExpense = document.getElementById('detail-expense');
            if (setExpense) setExpense.textContent = `Gs. ${stats.movementsOut.toLocaleString()}`;

            // Correct Formula: 
            // Expected Cash = Petty Cash + Cash Sales + Cash Delivery + Extra In - Expenses
            // Note: 'stats.efectivo' already includes Cash Sales + Cash Delivery Fees.
            const newExpected = APP_STATE.pettyCash + stats.efectivo + stats.movementsIn - stats.movementsOut;

            const setExpected = document.getElementById('expected-cash-display');
            if (setExpected) setExpected.textContent = `Gs. ${newExpected.toLocaleString()}`;
            APP_STATE.expectedCash = newExpected;
        } catch (error) {
            console.error('Error en updateCloseShiftBreakdown:', error);
            this.showToast('Error cargando datos de cierre', 'error');
        }
    },

    // --- UTILS ---
    getFormattedDate: function (dateObj = new Date()) {
        // Force dd/mm/yyyy format regardless of browser locale
        const d = dateObj.getDate().toString().padStart(2, '0');
        const m = (dateObj.getMonth() + 1).toString().padStart(2, '0');
        const y = dateObj.getFullYear();
        return `${d}/${m}/${y}`;
    },

    getTodayBreakdown: async function () {
        const today = new Date().toLocaleDateString();

        // Use local cache if available, otherwise fetch all orders (no index needed)
        let orders = [];

        if (APP_STATE.ordersCache && APP_STATE.ordersCache.length > 0) {
            // Use cached orders (already filtered by limitToLast(50) in listener)
            orders = APP_STATE.ordersCache;
        } else {
            // Fallback: Fetch recent orders without orderByChild (no index needed)
            try {
                const snap = await firebase.database().ref('orders').limitToLast(100).once('value');
                snap.forEach(c => {
                    orders.push({ key: c.key, ...c.val() });
                });
            } catch (e) {
                console.error("DB Error fetching orders:", e);
                return { pizza: 0, drink: 0, delivery: 0, total: 0, efectivo: 0, transfer: 0, movementsIn: 0, movementsOut: 0 };
            }
        }

        let pizza = 0, drink = 0, delivery = 0, total = 0;
        let efectivo = 0, transfer = 0;

        // Filter by today's date in memory (faster, no index needed)
        orders.forEach(o => {
            if (o.date === today && o.payStatus === 'paid' && o.status !== 'cancelled') {
                const orderTotal = (o.total || 0);
                const orderDelivery = (o.deliveryFee || 0);
                const fullAmount = orderTotal + orderDelivery;

                total += fullAmount;
                delivery += orderDelivery;

                if (o.method === 'Efectivo') efectivo += fullAmount;
                else transfer += fullAmount;

                (o.items || []).forEach(i => {
                    const isPizza = i.type === 'pizza' || i.cat === 'flavors';
                    const isDrink = i.type === 'drink' || i.cat === 'drinks';
                    if (isPizza) pizza += (i.price || 0);
                    if (isDrink) drink += (i.price || 0);
                });
            }
        });

        // 2. Fetch Movements (Expenses/Income) - no index needed
        let movementsIn = 0;
        let movementsOut = 0;

        try {
            const snapMov = await firebase.database().ref('movements').once('value');
            snapMov.forEach(c => {
                const m = c.val();
                if (m.date === today) {
                    if (m.type === 'ingreso') movementsIn += (m.amount || 0);
                    else movementsOut += (m.amount || 0);
                }
            });
        } catch (e) {
            console.error("DB Error fetching movements:", e);
        }

        return { pizza, drink, delivery, total, efectivo, transfer, movementsIn, movementsOut };
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

                    // Fix: XSS (Vuln 3)
                    const safeDesc = this.escapeHtml(m.desc);
                    const safeTime = this.escapeHtml(m.timestamp);

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
                                <button class="btn-mov-delete" onclick="app.deleteMovement('${key}', '${m.type}', ${m.amount})">×</button>
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
        // M1 FIX: Better confirmation with amount display
        if (!confirm(`¿Eliminar ${type} de Gs. ${amount.toLocaleString()}?`)) return;

        firebase.database().ref('movements').child(key).remove((error) => {
            if (error) {
                this.showToast('Error al eliminar: ' + error.message, 'error');
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

    closeShift: async function () {
        try {
            console.log("🔒 Iniciando cierre de caja...");
            const counted = APP_STATE._currentCalcTotal || 0;
            const expected = APP_STATE.expectedCash;

            // Validation: Ensure total contado is not "Gs. 0" if expected is > 0 OR at least some input was touched
            const anyInput = Array.from(document.querySelectorAll('.cash-calc')).some(i => i.value !== '');
            if (!anyInput && expected > 0) {
                this.showToast("Debes realizar el conteo de billetes para cerrar la caja.", "error"); // Replaced alert
                return;
            }

            this.showToast("🔒 Procesando cierre...", "info");
            const todayStr = new Date().toLocaleDateString();

            // 1. Fetch Movements
            const movSnap = await firebase.database().ref('movements').once('value');
            const movs = [];
            let totalIn = 0;
            let totalOut = 0;
            movSnap.forEach(c => {
                const m = c.val();
                if (m.date === todayStr) {
                    movs.push(m);
                    if (m.type === 'ingreso') totalIn += m.amount;
                    else totalOut += m.amount;
                }
            });

            // 2. Fetch Stats
            const stats = await this.getTodayBreakdown();

            // 3. Generate Report Text
            let report = `=== CIERRE DE CAJA ===\n` +
                `Fecha: ${new Date().toLocaleString()}\n` +
                `Responsable: ${APP_STATE.role}\n\n` +
                `RESUMEN DINERO:\n` +
                `- Caja Chica Inicio: Gs. ${APP_STATE.pettyCash.toLocaleString()}\n` +
                `- Ventas Efectivo:   Gs. ${APP_STATE.shiftSales.efectivo.toLocaleString()}\n` +
                `- Ingresos Extra:    Gs. ${totalIn.toLocaleString()}\n` +
                `- Gastos/Retiros:    Gs. ${totalOut.toLocaleString()}\n` +
                `---------------------------------\n` +
                `EFECTIVO ESPERADO:   Gs. ${APP_STATE.expectedCash.toLocaleString()}\n` +
                `EFECTIVO CONTADO:    Gs. ${counted.toLocaleString()}\n` +
                `DIFERENCIA:          Gs. ${(counted - APP_STATE.expectedCash).toLocaleString()}\n\n` +
                `=================================\n\n` +
                `DETALLE DELIVERY:\n` +
                `- Costo Delivery:    Gs. ${stats.delivery.toLocaleString()}\n\n` +
                `MOVIMIENTOS DE CAJA:\n` +
                (movs.length > 0 ?
                    movs.map(m => `[${m.type.toUpperCase()}] ${m.desc}: Gs. ${m.amount.toLocaleString()}`).join('\n') : "Sin movimientos registrados") +
                `\n\nDETALLE DE PRODUCTOS VENDIDOS:\n` +
                Object.entries(APP_STATE.shiftSales.items).map(([name, count]) => `- ${name}: ${count}`).join('\n');

            const splitReport = `\n\nDESGLOSE DE VENTAS:\n` +
                `- Ventas Pizzas:     Gs. ${stats.pizza.toLocaleString()}\n` +
                `- Ventas Bebidas:    Gs. ${stats.drink.toLocaleString()}\n` +
                `- Costo Delivery:    Gs. ${stats.delivery.toLocaleString()}`;

            const finalReport = report + splitReport;



            // 4. Download Report
            const blob = new Blob([finalReport], { type: 'text/plain' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            const safeDate = new Date().toISOString().split('T')[0];
            link.download = `Cierre_Caja_${safeDate}.txt`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // 5. Archive Orders
            this.showToast("📦 Archivando pedidos...", "info");
            const ordersSnap = await firebase.database().ref('orders').once('value');
            const archivePromises = [];

            ordersSnap.forEach(child => {
                const order = child.val();
                if (order.status === 'completed' && order.payStatus === 'paid') {
                    const archiveRef = firebase.database().ref(`orders_archive/${safeDate}/${child.key}`);
                    archivePromises.push(
                        archiveRef.set(order).then(() => child.ref.remove())
                    );
                }
            });

            await Promise.all(archivePromises);

            console.log("✅ Cierre completado exitosamente");

            // 6. Reset & Close
            localStorage.removeItem('ore_pos_state');
            await firebase.database().ref('config/shopStatus').set({
                status: 'closed',
                timestamp: Date.now()
            });

            this.showToast("✅ Turno cerrado correctamente", "success");
            setTimeout(() => location.reload(), 2000);

        } catch (error) {
            console.error("Error CRÍTICO en closeShift:", error);
            if (error.code === 'PERMISSION_DENIED') {
                this.showToast("⛔ ERROR DE PERMISOS: No se pudo archivar. Revisa las reglas de Firebase.", "error");
            } else {
                this.showToast("Error al cerrar: " + error.message, "error");
            }
        }
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
                 onclick="app.selectClient('${c.name}')">${c.name}</div>
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
                <div style="font-weight: bold; font-size: 1.1rem; margin-bottom: 5px;">${c.name}</div>
                <div style="display: flex; gap: 10px;">
                    <button class="btn btn-gold" style="padding: 5px 10px; font-size: 0.8rem;" onclick="app.selectClient('${c.name}'); app.switchTab('order')">SELECCIONAR</button>
                    <button class="btn" style="padding: 5px 10px; font-size: 0.8rem; background: #333;" onclick="app.deleteClient('${c.name}')">ELIMINAR</button>
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
        // M4 FIX: Validate cart has items before showing delivery options
        if (APP_STATE.cart.length === 0) {
            this.showToast('Agrega productos primero', 'error');
            document.getElementById('order-type').value = 'Para Comer Acá';
            return;
        }

        const type = document.getElementById('order-type').value;
        const container = document.getElementById('delivery-fee-container');
        if (type === 'Delivery') {
            container.classList.remove('hidden');
        } else {
            container.classList.add('hidden');
            document.getElementById('delivery-fee').value = '';
        }
    },

    // --- ADMIN STATISTICS (PREMIUM 2.0) ---
    // Helper: Generate Firebase Push ID from Timestamp for Range Queries
    generatePushID: function (timestamp) {
        const PUSH_CHARS = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';
        let now = timestamp;
        const timeStampChars = new Array(8);
        for (let i = 7; i >= 0; i--) {
            timeStampChars[i] = PUSH_CHARS.charAt(now % 64);
            now = Math.floor(now / 64);
        }
        return timeStampChars.join('');
    },

    loadAdminStats: async function () {
        const period = document.getElementById('admin-period-select').value;
        const kpiContainer = document.querySelector('.kpi-grid');
        const listContainer = document.getElementById('visual-stats-list');

        // UI Loading State
        if (kpiContainer) kpiContainer.style.opacity = '0.5';

        // Define Time Range
        const now = new Date();
        let startTime, endTime;

        if (period === 'today') {
            startTime = new Date(now.setHours(0, 0, 0, 0)).getTime();
            endTime = new Date(now.setHours(23, 59, 59, 999)).getTime();
        } else if (period === 'week') {
            const day = now.getDay() || 7;
            if (day !== 1) now.setHours(-24 * (day - 1));
            startTime = new Date(now.setHours(0, 0, 0, 0)).getTime();
            endTime = new Date().getTime();
        } else if (period === 'month') {
            startTime = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
            endTime = new Date().getTime();
        } else if (period === 'year') {
            startTime = new Date(now.getFullYear(), 0, 1).getTime();
            endTime = new Date().getTime();
        }

        console.log(`📡 Admin Stats: ${period}`);

        const startKey = this.generatePushID(startTime) + '-0000000000000000000';
        const endKey = this.generatePushID(endTime) + '-zzzzzzzzzzzzzzzzzzz';

        try {
            const snap = await APP_STATE.dbRef.orderByKey().startAt(startKey).endAt(endKey).once('value');

            let totalSales = 0, netSales = 0, deliveryFees = 0, ordersCount = 0;
            let paymentMethods = { 'Efectivo': 0, 'Transferencia': 0 };
            let statsPizza = 0, statsDrink = 0;
            let productCounts = {};

            APP_STATE.adminReportData = [];

            snap.forEach(child => {
                const o = child.val();
                if (o.status === 'cancelled') return;

                if (o.payStatus === 'paid') {
                    const orderTotal = (o.total || 0);
                    const orderDelivery = (o.deliveryFee || 0);
                    const fullAmount = orderTotal + orderDelivery;

                    totalSales += fullAmount;
                    deliveryFees += orderDelivery;
                    ordersCount++;

                    if (o.method === 'Efectivo') paymentMethods['Efectivo'] += fullAmount;
                    else paymentMethods['Transferencia'] += fullAmount;
                }

                if (o.items) {
                    o.items.forEach(i => {
                        if (i.type === 'pizza') statsPizza++;
                        else if (i.type === 'drink') statsDrink++;
                        const name = i.name || "Unknown";
                        productCounts[name] = (productCounts[name] || 0) + 1;
                    });
                }

                APP_STATE.adminReportData.push({
                    id: o.id,
                    date: o.date,
                    time: o.timestamp,
                    customer: o.customer,
                    total: o.total,
                    delivery: o.deliveryFee,
                    method: o.method,
                    status: o.payStatus,
                    items: o.items ? o.items.map(i => i.name).join(' + ') : ''
                });
            });

            // Fetch Movements
            const movSnap = await firebase.database().ref('movements').orderByKey().startAt(startKey).endAt(endKey).once('value');
            let expenses = 0, extraIncome = 0;

            movSnap.forEach(m => {
                const mov = m.val();
                if (mov.type === 'ingreso') extraIncome += (mov.amount || 0);
                else if (mov.type === 'gasto' || mov.type === 'retiro') expenses += (mov.amount || 0);
            });

            netSales = totalSales + extraIncome - expenses;
            const avgTicket = ordersCount > 0 ? (totalSales / ordersCount) : 0;

            // UI Updates
            if (document.getElementById('kpi-total')) {
                document.getElementById('kpi-total').textContent = this.formatGs(totalSales);
                document.getElementById('kpi-net').textContent = this.formatGs(netSales);
                document.getElementById('kpi-orders').textContent = ordersCount;
                document.getElementById('kpi-orders-breakdown').textContent = `${statsPizza} Pizzas | ${statsDrink} Bebidas`;
                document.getElementById('kpi-ticket').textContent = this.formatGs(Math.round(avgTicket));

                const breakdownHTML = `
                    <div class="breakdown-row"><span>Ventas Efectivo</span><span style="color:#4caf50">${this.formatGs(paymentMethods['Efectivo'])}</span></div>
                    <div class="breakdown-row"><span>Ventas Transferencia</span><span style="color:#2196f3">${this.formatGs(paymentMethods['Transferencia'])}</span></div>
                    <div class="breakdown-row"><span>Costo Delivery</span><span>${this.formatGs(deliveryFees)}</span></div>
                    <div class="breakdown-row" style="color:var(--success)"><span>+ Ingresos Extra</span><span>${this.formatGs(extraIncome)}</span></div>
                    <div class="breakdown-row" style="color:var(--danger)"><span>- Gastos / Retiros</span><span>${this.formatGs(expenses)}</span></div>
                    <div class="breakdown-row total"><span>Beneficio Neto</span><span style="color:var(--primary-gold)">${this.formatGs(netSales)}</span></div>
                `;
                document.getElementById('admin-cash-breakdown').innerHTML = breakdownHTML;

                const sortedProducts = Object.entries(productCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
                let visualHTML = '';
                if (sortedProducts.length === 0) visualHTML = '<p style="text-align:center; color:#666; padding:20px;">Sin datos aún...</p>';
                else {
                    const maxCount = sortedProducts[0][1];
                    sortedProducts.forEach(([name, count]) => {
                        const percent = (count / maxCount) * 100;
                        visualHTML += `
                            <div class="visual-bar-item">
                                <div class="visual-header"><span>${name}</span><span>${count}</span></div>
                                <div class="visual-track"><div class="visual-fill" style="width: ${percent}%;"></div></div>
                            </div>`;
                    });
                }
                document.getElementById('visual-stats-list').innerHTML = visualHTML;
            }

        } catch (e) {
            console.error(e);
            alert("Error: " + e.message);
        } finally {
            if (kpiContainer) kpiContainer.style.opacity = '1';
        }
    },

    exportAdminReport: function () {
        if (!APP_STATE.adminReportData || APP_STATE.adminReportData.length === 0) return alert("No hay datos para exportar.");

        let csvContent = "data:text/csv;charset=utf-8,ID,Fecha,Hora,Cliente,Total,Delivery,Metodo,Estado,Items\n";
        APP_STATE.adminReportData.forEach(row => {
            csvContent += `${row.id},${row.date},${row.time},${row.customer},${row.total},${row.delivery},${row.method},${row.status},${row.items}\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Reporte_Admin_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },

    // --- ADMIN SIDEBAR NAVIGATION ---
    switchAdminTab: function (tabName) {
        document.querySelectorAll('.admin-menu-item').forEach(el => el.classList.remove('active'));

        if (tabName === 'dashboard') {
            document.getElementById('menu-dash').classList.add('active');
            document.getElementById('admin-main-area').classList.remove('hidden');
            document.getElementById('admin-products-area').classList.add('hidden');
            document.getElementById('admin-db-area').classList.add('hidden');
            this.loadAdminStats();
        } else if (tabName === 'products') {
            document.getElementById('menu-prod').classList.add('active');
            document.getElementById('admin-main-area').classList.add('hidden');
            document.getElementById('admin-products-area').classList.remove('hidden');
            document.getElementById('admin-db-area').classList.add('hidden');
        } else if (tabName === 'db') {
            document.getElementById('menu-db').classList.add('active');
            document.getElementById('admin-main-area').classList.add('hidden');
            document.getElementById('admin-products-area').classList.add('hidden');
            document.getElementById('admin-db-area').classList.remove('hidden');
            this.checkDBHealth();
        }
    },

    // --- DB MAINTENANCE (PRO V2) ---
    checkDBHealth: async function () {
        // Count entries in background
        const snap = await APP_STATE.dbRef.shallow().once('value'); // Shallow fetch keys only if possible (Firebase RTDB shallow support is limited mostly to REST, but SDK does full fetch unless using REST).
        // Since JS SDK doesn't support true shallow count without download, for Free Tier safety, we will restrict to checking metadata if available, OR just download all keys (minimal bandwidth compared to full objects).
        // For this implementation, we will fetch order KEYS only using REST API logic if possible, but standard SDK method:
        // We will orderByKey and limitToLast(1) to get the latest, but to COUNT we need more.
        // Practical approach for small DBs: Fetch all keys. 

        document.getElementById('db-total-orders').textContent = "Analizando...";

        APP_STATE.dbRef.once('value', snap => {
            const count = snap.numChildren();
            const limit = 5000;
            const percent = Math.min((count / limit) * 100, 100);

            document.getElementById('db-total-orders').textContent = count.toLocaleString();
            document.getElementById('db-usage-bar').style.width = percent + '%';

            const statusEl = document.getElementById('db-health-status');
            const msgEl = document.getElementById('db-health-msg');
            const iconEl = document.getElementById('db-health-icon');
            const cardEl = document.getElementById('db-health-card');
            const barEl = document.getElementById('db-usage-bar');

            if (count < 3000) {
                statusEl.textContent = "Saludable";
                msgEl.textContent = "Uso bajo de recursos. Todo en orden.";
                iconEl.textContent = "✅";
                cardEl.style.borderLeftColor = "#2e7d32";
                barEl.style.backgroundColor = "#2e7d32";
            } else if (count < 5000) {
                statusEl.textContent = "Atención";
                msgEl.textContent = "La base de datos está creciendo. Considera una limpieza pronto.";
                iconEl.textContent = "⚠️";
                cardEl.style.borderLeftColor = "#f57c00";
                barEl.style.backgroundColor = "#f57c00";
            } else {
                statusEl.textContent = "CRÍTICO";
                msgEl.textContent = "Límite gratuito en riesgo de lentitud. ¡LIMPIEZA REQUERIDA!";
                iconEl.textContent = "🚨";
                cardEl.style.borderLeftColor = "#d32f2f";
                barEl.style.backgroundColor = "#d32f2f";
            }
        });
    },

    backupDatabase: async function () {
        const btn = document.getElementById('btn-backup');
        btn.textContent = "⏳ GENERANDO JSON...";
        btn.disabled = true;

        try {
            const snap = await firebase.database().ref('/').once('value');
            const data = snap.val();

            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", `BACKUP_ORE_FULL_${new Date().toISOString().split('T')[0]}.json`);
            document.body.appendChild(downloadAnchorNode); // required for firefox
            downloadAnchorNode.click();
            downloadAnchorNode.remove();

            alert("✅ Copia de Seguridad Descargada.\n\nGuarda este archivo en un lugar seguro (Google Drive / USB).");

            // Enable Clean Button
            document.getElementById('btn-clean').disabled = false;
            document.getElementById('btn-clean').style.opacity = "1";
            document.getElementById('btn-clean').style.cursor = "pointer";

        } catch (e) {
            alert("Error generando backup: " + e.message);
        } finally {
            btn.textContent = "📥 1. DESCARGAR COPIA COMPLETA (JSON)";
            btn.disabled = false;
        }
    },

    cleanDatabase: async function () {
        const scope = document.getElementById('db-clean-scope').value;
        if (!confirm("⚠️ ¡PELIGRO! ⚠️\n\nEstás a punto de borrar datos de forma PERMANENTE.\n¿Ya descargaste y verificaste tu copia de seguridad?\n\nEsta acción NO se puede deshacer.")) return;

        let cutoffDate = new Date();

        if (scope === '3months') cutoffDate.setMonth(cutoffDate.getMonth() - 3);
        else if (scope === '6months') cutoffDate.setMonth(cutoffDate.getMonth() - 6);
        else if (scope === '1year') cutoffDate.setFullYear(cutoffDate.getFullYear() - 1);
        else if (scope === 'all') { // Reset logic 
            const verify = prompt("Para borrar TODO el historial, escribe 'BORRAR TODO':");
            if (verify !== 'BORRAR TODO') return alert("Acción cancelada.");

            await APP_STATE.dbRef.remove();
            await firebase.database().ref('orders_archive').remove();
            await firebase.database().ref('movements').remove();

            alert("Base de datos REINICIADA completamente.");
            window.location.reload();
            return;
        }

        // Partial cleanup based on date
        // Strategy: Iterate recent orders is not efficient for verification, 
        // but for deletion we need to find OLD ones.
        // We will iterate keys. Since PushIDs are timestamp based, we can calculate the cutoff PushID.

        const maxKey = this.generatePushID(cutoffDate.getTime()) + '-zzzzzzzz';

        const loader = document.getElementById('btn-clean');
        loader.textContent = "⏳ BORRANDO...";

        try {
            // Find orders OLDER than maxKey (startAt 0, endAt maxKey)
            // Note: generatePushID handles the timestamp conversion.
            const ordersRef = APP_STATE.dbRef;
            const snap = await ordersRef.orderByKey().endAt(maxKey).once('value');

            let count = 0;
            const updates = {};

            snap.forEach(child => {
                updates[child.key] = null; // Delete
                count++;
            });

            if (count === 0) {
                alert("No se encontraron registros tan antiguos para borrar.");
            } else {
                await ordersRef.update(updates);
                alert(`✅ Limpieza completada.\n\nSe eliminaron ${count} registros antiguos.`);
                this.checkDBHealth(); // Refresh UI
            }

        } catch (e) {
            alert("Error en limpieza: " + e.message);
        } finally {
            loader.textContent = "🗑️ 3. ELIMINAR DATOS SELECCIONADOS";
            // Disable again for safety
            document.getElementById('btn-clean').disabled = true;
            document.getElementById('btn-clean').style.opacity = "0.5";
            document.getElementById('btn-clean').style.cursor = "not-allowed";
        }
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
                    <div class="flavor-card" id="card-${f.id}" onclick="app.selectFlavor('${f.id}')">
                        <div class="flavor-img" ${f.img ? `style="background-image: url('${f.img}'); background-size: cover;"` : ''}></div>
                        <span style="font-weight: bold; color: #dac0a3;">${f.name}</span>
                        ${f.ingredients ? `<p style="color: #bbb; font-size: 0.65rem; margin: 4px 0; line-height: 1.2;">${f.ingredients}</p>` : ''}
                        <span style="display:block; margin-top:5px; color: var(--primary-gold); font-size: 0.9rem;">Gs. ${(parseInt(f.price) || 0).toLocaleString('es-PY')}</span>
                    </div>
                `).join('');
            }
        }

        // Drinks
        const dContainer = document.getElementById('drinks-container');
        if (dContainer) {
            dContainer.innerHTML = APP_STATE.products.drinks.map(d => `
                <div class="flavor-card" onclick="app.addDrink('${d.id}')">
                        <div class="flavor-img" style="border-radius:0; background:none; font-size:2rem; ${d.img ? `background-image: url('${d.img}'); background-size: contain; background-repeat: no-repeat; background-position: center; border:none;` : ''}">${d.img ? '' : '🥤'}</div>
                    <span style="font-weight: bold; font-size: 0.9rem;">${d.name}</span>
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

        // Fix: Average price for Half & Half (Request: (P1 + P2) / 2)
        const totalPrice = selectedObjs.reduce((sum, f) => sum + f.price, 0);
        const price = totalPrice / selectedObjs.length;

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
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-desc">${item.notes || ''}</div>
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

        // Fix: XSS (Vuln 3) - Sanitize Name
        const safeCustomerName = this.escapeHtml(customerName);

        const orderType = document.getElementById('order-type').value;
        // Fix: Explicitly force 0 if not Delivery to avoid UI glitches
        let deliveryFee = 0;
        if (orderType === 'Delivery') {
            deliveryFee = parseInt(document.getElementById('delivery-fee').value) || 0;
        }
        const paymentMethod = document.getElementById('payment-method').value;

        const isEditing = APP_STATE._editingOrderKey !== null;
        const editingOrder = isEditing ? APP_STATE.ordersCache.find(o => o.key === APP_STATE._editingOrderKey) : null;

        // --- PRICE VALIDATION & RECONSTRUCTION (Vuln 6) ---
        // We do NOT trust call item.price. We look it up.
        // Note: For custom pizzas this logic needs to be robust.
        // Current logic: item object has {type, name, price, notes}
        // Ideally we would store IDs in cart. But currently we store display objects.
        // MITIGATION: Iterate cart and if type is 'drink', re-fetch price. 
        // For Pizzas, price is Max of selected flavors.
        // Since we don't have IDs in cart for Pizza construction easily available here without refactor,
        // we will guard against "Zero Price".
        const itemsToSend = APP_STATE.cart.map(item => {
            // Security check: Price sanity
            if (!item.price || item.price < 500) {
                console.warn("Suspicious price detected:", item);
                // In strict mode we would reject. Here we FORCE a min price or check products.
                // Better: If it's a drink, find it.
                if (item.type === 'drink') {
                    const realDrink = APP_STATE.products.drinks.find(d => d.name === item.name); // Weak link: searching by name
                    if (realDrink) item.price = realDrink.price;
                }
            }
            return {
                ...item,
                name: this.escapeHtml(item.name), // XSS
                notes: this.escapeHtml(item.notes) // XSS
            };
        });

        // Items logic for stock dec (simplified for validation)
        const pizzasCount = itemsToSend.filter(i => i.type === 'pizza').length;
        const drinksCount = itemsToSend.filter(i => i.type === 'drink').length;

        // --- STOCK TRANSACTION REMOVED (Reverting to "As Before" per user request) ---
        // We will do optimistic local check or simple one-time check if needed, 
        // but primarily we just process the order to ensure UX flow works.

        // Create Order Object
        const self = this;
        this.getNextId(function (seqId) {
            const newOrder = {
                id: isEditing ? (editingOrder.status === 'ready' ? `${editingOrder.id}-B` : editingOrder.id) : seqId,
                customer: safeCustomerName,
                items: itemsToSend,
                total: itemsToSend.reduce((sum, i) => sum + i.price, 0),
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
                    items: newOrder.items,
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

            // TRACK SHIFT STATS
            if (payStatus === 'paid') {
                APP_STATE.shiftSales.total += newOrder.total;
                APP_STATE.shiftSales.deliveryFees += deliveryFee;

                if (newOrder.method === 'Efectivo') {
                    APP_STATE.shiftSales.efectivo += newOrder.total + deliveryFee;
                    APP_STATE.deliveryEfectivo += deliveryFee;
                    APP_STATE.expectedCash += newOrder.total + deliveryFee;
                } else {
                    APP_STATE.shiftSales.transfer += newOrder.total + deliveryFee;
                }

                self.saveLocalState();
            }

            // Push to Firebase
            APP_STATE.dbRef.push(newOrder, function (error) {
                if (error) {
                    alert("Error al enviar: " + error.message);
                } else {
                    alert(`Pedido Enviado (${payStatus === 'paid' ? 'PAGADO' : 'PENDIENTE'})`);

                    // DECREMENT STOCK (Post-order, optimistic)
                    const stockRef = firebase.database().ref('stock');
                    stockRef.transaction(current => {
                        if (!current) return;
                        const pizzasCount = itemsToSend.filter(i => i.type === 'pizza').length;
                        const drinksCount = itemsToSend.filter(i => i.type === 'drink').length;
                        return {
                            masas: (current.masas || 0) - pizzasCount,
                            drinks: (current.drinks || 0) - drinksCount
                        };
                    });

                    // Update Local UI
                    APP_STATE.stock -= itemsToSend.filter(i => i.type === 'pizza').length;
                    APP_STATE.stockDrinks -= itemsToSend.filter(i => i.type === 'drink').length;
                    self.updateStockUI();

                    // AUTO-SAVE CLIENT
                    const isNew = !APP_STATE.clients.some(c => c.name.toLowerCase() === safeCustomerName.toLowerCase());
                    if (isNew && safeCustomerName.toLowerCase() !== 'ocasional') {
                        firebase.database().ref('clients').push({ name: safeCustomerName });
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
                this.updatePendingBadge(0);
                return;
            }

            const orders = Object.entries(data).map(([key, value]) => ({ key, ...value }));
            APP_STATE.ordersCache = orders; // Store for local filtering

            // Update pending orders badge (always, even if tab not visible)
            const pendingCount = orders.filter(o => o.payStatus === 'pending' && o.status !== 'cancelled').length;
            this.updatePendingBadge(pendingCount);

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

        // Count pending orders for notification badge
        const pendingCount = APP_STATE.ordersCache.filter(o => o.payStatus === 'pending' && o.status !== 'cancelled').length;
        this.updatePendingBadge(pendingCount);

        sorted.forEach(o => {
            const canCancel = o.status === 'cooking';
            const canEdit = o.payStatus === 'pending';
            const isPending = o.payStatus === 'pending';

            list.innerHTML += `
                <div class="ticket" style="width: 280px; border-color: ${o.payStatus === 'paid' ? 'var(--success)' : 'var(--pending)'}; overflow: visible;">
                    <div class="ticket-header" style="position: relative;">
                        #${o.id} - ${this.escapeHtml(o.customer) || 'S/N'}
                        ${isPending ? '<span style="position: absolute; top: 50%; right: 10px; transform: translateY(-50%); background: linear-gradient(135deg, #ff9800, #f57c00); color: white; font-size: 0.65rem; padding: 3px 8px; border-radius: 10px; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">⚠️ PENDIENTE</span>' : ''}
                    </div>
                    <div class="ticket-body">
                        Total: Gs. ${(o.total || 0).toLocaleString()}${o.deliveryFee ? ` (+Gs. ${o.deliveryFee.toLocaleString()} Delivery)` : ''}<br>
                        Estado: ${o.status === 'cooking' ? 'COCINANDO' : (o.status === 'ready' ? 'LISTO' : this.escapeHtml(o.status))}<br>
                        Pago: <b>${o.payStatus === 'paid' ? 'PAGADO' : 'PENDIENTE'}</b>
                    </div>
                    <div class="ticket-footer" style="display: flex; gap: 5px; flex-wrap: wrap;">
                        ${o.payStatus === 'pending' ? `<button class="btn btn-gold" style="flex:1; min-width: 80px;" onclick="app.markPaid('${o.key}')">💰 COBRAR</button>` : ''}
                        ${canEdit ? `<button class="btn" style="flex:1; min-width: 80px; background: #2196f3; color: white;" onclick="app.editOrder('${o.key}')">EDITAR</button>` : ''}
                        ${canCancel ? `<button class="btn" style="flex:1; min-width: 80px; background: #d32f2f; color: white;" onclick="app.cancelOrder('${o.key}')">ANULAR</button>` : ''}
                    </div>
                </div>
            `;
        });
    },

    // Update notification badge on Enviados tab
    updatePendingBadge: function (count) {
        const badge = document.getElementById('pending-badge');
        if (!badge) return;

        if (count > 0) {
            badge.textContent = count > 9 ? '9+' : count;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    },

    markPaid: function (key) {
        // Open change calculator modal instead of direct payment
        this.openChangeModal(key);
    },

    // Open change calculator modal for payment
    openChangeModal: function (key) {
        const order = APP_STATE.ordersCache.find(o => o.key === key);
        if (!order || order.payStatus !== 'pending') return;

        APP_STATE._payingOrderKey = key;
        const totalWithDelivery = (order.total || 0) + (order.deliveryFee || 0);

        document.getElementById('change-order-info').textContent = `#${order.id} - ${order.customer || 'S/N'}`;
        document.getElementById('change-total').textContent = `Gs. ${totalWithDelivery.toLocaleString()}`;
        document.getElementById('change-pay-amount').value = '';
        document.getElementById('change-result').textContent = 'Gs. 0';
        document.getElementById('modal-change').classList.remove('hidden');

        // Focus input for quick typing
        setTimeout(() => document.getElementById('change-pay-amount').focus(), 100);
    },

    calculateModalChange: function () {
        const order = APP_STATE.ordersCache.find(o => o.key === APP_STATE._payingOrderKey);
        if (!order) return;

        const totalWithDelivery = (order.total || 0) + (order.deliveryFee || 0);
        const payAmount = parseInt(document.getElementById('change-pay-amount').value) || 0;
        const change = payAmount - totalWithDelivery;

        const changeEl = document.getElementById('change-result');
        if (change >= 0) {
            changeEl.textContent = `Gs. ${change.toLocaleString()}`;
            changeEl.style.color = '#4caf50';
        } else {
            changeEl.textContent = `Gs. 0`;
            changeEl.style.color = '#888';
        }
    },

    confirmPayment: function () {
        const key = APP_STATE._payingOrderKey;
        const order = APP_STATE.ordersCache.find(o => o.key === key);
        if (!order || order.payStatus !== 'pending') return;

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

        // Close modal and show confirmation
        this.closeModal('modal-change');
        APP_STATE._payingOrderKey = null;

        // Show change to deliver
        const payAmount = parseInt(document.getElementById('change-pay-amount').value) || 0;
        const totalWithDelivery = (order.total || 0) + (order.deliveryFee || 0);
        const change = payAmount - totalWithDelivery;

        if (change > 0) {
            alert(`✅ Pedido COBRADO\n\n💵 Entregar vuelto: Gs. ${change.toLocaleString()}`);
        } else {
            alert("✅ Pedido marcado como COBRADO");
        }
    },

    closeModal: function (modalId) {
        document.getElementById(modalId).classList.add('hidden');
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

        // PERSIST RESTORED STOCK TO DB
        const stockRef = firebase.database().ref('stock');
        stockRef.transaction(current => {
            if (!current) return;
            return {
                masas: (current.masas || 0) + pizzasCount,
                drinks: (current.drinks || 0) + drinksCount
            };
        });

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

            // Sort items: Pizza first
            const items = (o.items || []).sort((a, b) => {
                const typeA = a.type || 'other'; // fallback
                const typeB = b.type || 'other';
                // Pizza priority
                if (typeA === 'pizza' && typeB !== 'pizza') return -1;
                if (typeA !== 'pizza' && typeB === 'pizza') return 1;
                return 0;
            });

            let itemsHtml = items.map(i => {
                // Simplify text: "Pizza Mitad: X" -> "Mitad: X"
                let displayName = i.name.replace(/Pizza Mitad:/gi, 'Mitad:');

                return `<li>${displayName} ${i.notes ? `<br><small style='color:#f57c00'>(${i.notes})</small>` : ''}</li>`;
            }).join('');

            return `
            <div class="ticket ${isPaid ? 'paid' : 'pending-pay'}" 
                 style="${isReady ? 'opacity: 0.5; transform: scale(0.9);' : ''} ${isLocal ? 'border-left: 5px solid #2196f3;' : ''}">
                <div class="ticket-header" style="${isPaid ? 'background: var(--success); color: white;' : 'background: var(--pending); color: white;'}">
                    <span>#${o.id} - ${o.customer || 'S/N'}</span>
                    <span>${o.timestamp}</span>
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
