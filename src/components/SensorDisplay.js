import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, query, limitToLast } from 'firebase/database';  // Importamos funciones necesarias
import { initializeApp } from 'firebase/app';
import './SensorDisplay.css';

// Configuración de Firebase
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);  // Inicializa la Realtime Database

const SensorDisplay = () => {
    const [sensorData, setSensorData] = useState({
        temperatura1: null,
        temperatura2: null,
        humedad: null,
        humedadSuelo: null,
    });
    const [loading, setLoading] = useState(true);  // Estado para indicar carga
    const [error, setError] = useState(null);      // Estado para manejar errores

    useEffect(() => {
        // Referencia a la ruta de datos en Realtime Database, limitando a los últimos datos
        const sensorRef = query(ref(db, 'sensores'), limitToLast(1));  // Obtener el último nodo agregado

        // Escuchar los datos en tiempo real
        const unsubscribe = onValue(sensorRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const lastKey = Object.keys(data)[0];  // Obtenemos la clave del último nodo
                setSensorData(data[lastKey]);  // Guardamos los datos del último nodo
                setLoading(false);  // Desactivar el estado de carga
            } else {
                console.log("No se encontraron datos!");
                setError("No se encontraron datos de sensores.");
                setLoading(false);
            }
        }, (errorObject) => {
            console.error("Error obteniendo los datos de sensores:", errorObject);
            setError("Error al obtener los datos de los sensores.");
            setLoading(false);
        });

        // Limpiar la suscripción cuando el componente se desmonta
        return () => unsubscribe();
    }, []);

    if (loading) {
        return <div>Cargando datos de sensores...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="sensor-grid">
            <div className="sensor-box">Termómetro Interior: {sensorData.temperatura1 ?? 'N/A'} °C</div>
            <div className="sensor-box">Termómetro Exterior: {sensorData.temperatura2 ?? 'N/A'} °C</div>
            <div className="sensor-box">Humedad: {sensorData.humedad ?? 'N/A'} %</div>
            <div className="sensor-box">Humedad de Suelo: {sensorData.humedadSuelo ?? 'N/A'} %</div>
        </div>
    );
};

export default SensorDisplay;
