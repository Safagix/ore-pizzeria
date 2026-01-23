// src/utils/formatters.js

/**
 * Formatea un número como moneda Guaraní (Gs.)
 * @param {number} amount 
 * @returns {string} Ej: "Gs. 50.000"
 */
export function formatCurrency(amount) {
    if (isNaN(amount)) return 'Gs. 0';
    return 'Gs. ' + amount.toLocaleString('es-PY');
}

/**
 * Formatea fecha corta
 */
export function formatDate(dateObj = new Date()) {
    return dateObj.toLocaleDateString('es-PY');
}
