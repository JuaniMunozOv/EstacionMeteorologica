// Importar las funciones necesarias de los SDKs de Firebase
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Las claves de configuración se colocan directamente aquí
// para que funcione en GitHub Pages.
const firebaseConfig = {
    apiKey: "AIzaSyBiwlET9GG29FjVwN7p1rhktC159_XdlDM",
    authDomain: "estacion-meteorologia.firebaseapp.com",
    databaseURL: "https://estacion-meteorologia-default-rtdb.firebaseio.com",
    projectId: "estacion-meteorologia",
    storageBucket: "estacion-meteorologia.firebasestorage.app",
    messagingSenderId: "955214933528",
    appId: "1:955214933528:web:20b23c54f57884a5fedd6d",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar REALTIME DATABASE y exportarla
const database = getDatabase(app);

export { database };

