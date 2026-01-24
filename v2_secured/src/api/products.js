// src/api/products.js
import { db, auth } from './firebase.js';

// Estado local caché (opcional, pero útil)
let productsCache = {
    flavors: [],
    drinks: []
};

/**
 * Escucha cambios en los productos en tiempo real
 * @param {Function} callback - Función a ejecutar cuando llegan datos (recibe {flavors, drinks})
 */
export function subscribeToProducts(callback) {
    // Auth Anónimo requerido por reglas de seguridad
    auth.signInAnonymously().catch(err => console.error("Auth Anon Error:", err));

    const productsRef = db.ref('products');

    productsRef.on('value', (snapshot) => {
        const data = snapshot.val();

        if (!data) {
            // Si no hay datos, sembramos la base de datos
            seedDatabase();
            return;
        }

        // Transformar de Objeto Firebase a Array manejable
        const flavors = data.flavors ? Object.values(data.flavors) : [];
        const drinks = data.drinks ? Object.values(data.drinks) : [];

        // Actualizar caché
        productsCache = { flavors, drinks };

        // Notificar a la UI
        if (callback) callback(productsCache);
    });
}

/**
 * Si la DB está vacía, carga los productos iniciales
 */
export function seedDatabase() {
    console.log("🌱 Sembrando base de datos con Carta Oficial...");

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

    // Usamos update para evitar duplicados si se corre varias veces sobre las mismas keys (aunque aquí usamos push, cuidado)
    // Para simplificar: primero borramos nodos si es necesario o confiamos en que solo se llama si data es null
    const updates = {};

    // NOTA: Usamos push() para generar IDs únicos de Firebase
    initialFlavors.forEach(p => db.ref('products/flavors').push(p));
    initialDrinks.forEach(p => db.ref('products/drinks').push(p));

    console.log("✅ Base de datos actualizada.");
}
