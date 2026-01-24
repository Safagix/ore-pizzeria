// src/api/orders.js
import { db } from './firebase.js';

/**
 * Genera el siguiente ID secuencial para un pedido.
 * @param {Function} callback - Retorna el ID generado (ej. 1001)
 */
function getNextId(callback) {
    const counterRef = db.ref('config/lastOrderId');
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
}

/**
 * Crea un nuevo pedido en la base de datos.
 * Maneja automáticamente la asignación de ID secuencial si no se provee.
 * @param {Object} orderData - Datos del pedido (sin ID)
 * @returns {Promise<string>} - Retorna la KEY de Firebase del nuevo pedido
 */
export function createOrder(orderData) {
    return new Promise((resolve, reject) => {
        getNextId((seqId) => {
            const finalOrder = {
                ...orderData,
                id: orderData.id || seqId, // Usa secuencial si no es edición
                timestamp: new Date().toLocaleTimeString(),
                date: new Date().toLocaleDateString()
            };

            const newRef = db.ref('orders').push();
            newRef.set(finalOrder)
                .then(() => resolve({ key: newRef.key, id: finalOrder.id }))
                .catch(reject);
        });
    });
}

/**
 * Actualiza un pedido existente
 * @param {string} key - Key de Firebase
 * @param {Object} updates - Campos a actualizar
 */
export function updateOrder(key, updates) {
    return db.ref('orders').child(key).update(updates);
}

/**
 * Escucha la lista de pedidos en tiempo real
 * @param {Function} callback - Recibe array de pedidos
 * @param {number} limit - Cantidad de pedidos a traer (default 50)
 */
export function subscribeToOrders(callback, limit = 50) {
    db.ref('orders').limitToLast(limit).on('value', (snapshot) => {
        const data = snapshot.val();
        if (!data) {
            callback([]);
            return;
        }
        const orders = Object.entries(data).map(([key, value]) => ({ key, ...value }));
        callback(orders);
    });
}
