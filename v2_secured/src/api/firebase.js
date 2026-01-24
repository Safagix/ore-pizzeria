// src/api/firebase.js
// Responsabilidad: Inicializar Firebase y exportar referencias

// Asegurarnos de que la configuración global existe (cargada por js/config.js)
if (typeof window.CONFIG === 'undefined') {
    console.error("CRITICAL: js/config.js no se ha cargado.");
}

const firebaseConfig = window.CONFIG.firebase;

// Inicialización Singleton (para no reinicializar si ya existe)
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    try {
        firebase.initializeApp(firebaseConfig);
        console.log("✅ Firebase (src/api) Inicializado");
    } catch (e) {
        console.error("Error inicializando Firebase:", e);
    }
}

// Exportar instancias listas para usar
export const db = firebase.database();
export const auth = firebase.auth();
