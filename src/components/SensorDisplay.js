import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import './SensorDisplay.css';

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
const db = getFirestore(app);

const SensorDisplay = () => {
    const [sensorData, setSensorData] = useState({
        temperatura1: null,
        temperatura2: null,
        humedad: null,
        humedadSuelo: null,
        indiceDeCalor: null
    });
    const [loading, setLoading] = useState(true);  // Estado para indicar carga
    const [error, setError] = useState(null);      // Estado para manejar errores

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Obtener los datos desde Firebase Firestore
                const docRef = doc(db, "sensores", "datosActuales");
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setSensorData(docSnap.data());
                } else {
                    console.log("No se encontraron datos!");
                    setError("No se encontraron datos de sensores.");
                }
                setLoading(false);
            } catch (error) {
                console.error("Error obteniendo los datos de sensores:", error);
                setError("Error al obtener los datos de los sensores.");
                setLoading(false);
            }
        };

        // Llamar la primera vez inmediatamente
        fetchData();

        // Actualizar los datos cada 5 segundos
        const intervalId = setInterval(fetchData, 5000);

        return () => clearInterval(intervalId);
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
            <div className="sensor-box">Índice de Calor: {sensorData.indiceDeCalor ?? 'N/A'} °C</div>
        </div>
    );
};

export default SensorDisplay;
