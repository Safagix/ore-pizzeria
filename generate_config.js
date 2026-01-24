const fs = require('fs');

// Verifica si estamos en un entorno que tiene las variables (como Vercel)
// Si no hay variables, crea un archivo con valores vacíos para evitar errores de sintaxis, 
// aunque la app no conectará.
const configContent = `const CONFIG = {
    firebase: {
        apiKey: "${process.env.FIREBASE_API_KEY || ''}",
        authDomain: "${process.env.FIREBASE_AUTH_DOMAIN || ''}",
        databaseURL: "${process.env.FIREBASE_DATABASE_URL || ''}",
        projectId: "${process.env.FIREBASE_PROJECT_ID || ''}",
        storageBucket: "${process.env.FIREBASE_STORAGE_BUCKET || ''}",
        messagingSenderId: "${process.env.FIREBASE_MESSAGING_SENDER_ID || ''}",
        appId: "${process.env.FIREBASE_APP_ID || ''}"
    }
};`;

// Escribir el archivo
// Escribir el archivo en la carpeta original y en la v2_secured
try {
    fs.writeFileSync('./js/config.js', configContent);
    console.log('✅ js/config.js (Legacy) generado exitosamente.');

    // Asegurarse de que existe el directorio v2_secured
    if (fs.existsSync('./v2_secured/js')) {
        fs.writeFileSync('./v2_secured/js/config.js', configContent);
        console.log('✅ v2_secured/js/config.js (Secured) generado exitosamente.');
    }
} catch (err) {
    console.error('❌ Error generando js/config.js:', err);
    process.exit(1);
}
