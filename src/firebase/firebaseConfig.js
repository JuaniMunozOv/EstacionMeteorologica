// Importar las funciones necesarias de los SDKs de Firebase
import { initializeApp } from "firebase/app";
// ¡IMPORTANTE! Cambiamos getFirestore por getDatabase
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    // Tus variables de entorno aquí están perfectas
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar REALTIME DATABASE y exportarla
const database = getDatabase(app);

export { database };
