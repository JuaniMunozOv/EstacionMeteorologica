import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Claves públicas de Firebase (seguridad vía reglas RTDB).
// En Vercel podés sobreescribir con REACT_APP_FIREBASE_* si querés.
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyBiwlET9GG29FjVwN7p1rhktC159_XdlDM",
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "estacion-meteorologia.firebaseapp.com",
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL || "https://estacion-meteorologia-default-rtdb.firebaseio.com",
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "estacion-meteorologia",
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "estacion-meteorologia.firebasestorage.app",
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "955214933528",
    appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:955214933528:web:20b23c54f57884a5fedd6d",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
