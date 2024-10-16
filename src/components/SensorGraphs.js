import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { getDatabase, ref, onValue } from 'firebase/database';  // Cambiamos Firestore por Realtime Database
import { initializeApp } from 'firebase/app';
import './SensorGraphs.css';

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

// Registrando componentes necesarios de Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const SensorGraphs = () => {
    const [chartData, setChartData] = useState({
        timestamps: [],
        temperatura1: [],
        temperatura2: [],
        humedadSuelo: []
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Referencia a los datos de sensores en Realtime Database
        const sensorRef = ref(db, 'sensores');  // Cambiar la ruta si es necesario

        // Obtener datos de Realtime Database en tiempo real
        const unsubscribe = onValue(sensorRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const timestamps = [];
                const temp1Data = [];
                const temp2Data = [];
                const humedadSueloData = [];

                // Iterar sobre cada nodo para obtener los datos históricos
                Object.keys(data).forEach((key) => {
                    const record = data[key];
                    timestamps.push(key);  // Usamos el key (millis) como timestamp
                    temp1Data.push(parseFloat(record.temperatura1));  // Asegurarse de convertir los datos a número
                    temp2Data.push(parseFloat(record.temperatura2));
                    humedadSueloData.push(parseFloat(record.humedadSuelo));
                });

                // Actualizar los datos del gráfico
                setChartData({
                    timestamps: timestamps,
                    temperatura1: temp1Data,
                    temperatura2: temp2Data,
                    humedadSuelo: humedadSueloData
                });
                setLoading(false);
            } else {
                console.log("No hay datos históricos disponibles.");
                setError("No se encontraron datos de sensores.");
                setLoading(false);
            }
        }, (errorObject) => {
            console.error("Error obteniendo los datos históricos:", errorObject);
            setError("Error al obtener los datos históricos.");
            setLoading(false);
        });

        // Limpiar la suscripción cuando el componente se desmonta
        return () => unsubscribe();
    }, []);

    const createChartOptions = (yAxisTitle) => ({
        scales: {
            y: {
                min: yAxisTitle === 'Temperatura (°C)' ? -10 : 0,
                max: yAxisTitle === 'Temperatura (°C)' ? 50 : 100,
                title: {
                    display: true,
                    text: yAxisTitle
                }
            }
        },
        plugins: {
            tooltip: {
                mode: 'index',
                intersect: false
            }
        },
        maintainAspectRatio: false
    });

    const createChartData = (label, data, borderColor) => ({
        labels: chartData.timestamps,
        datasets: [
            {
                label: label,
                data: data,
                borderColor: borderColor,
                tension: 0.1
            }
        ]
    });

    if (loading) {
        return <div>Cargando gráficos de sensores...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="sensor-graphs-container">
            <div className="graph-box">
                <Line data={createChartData('Temperatura Interior', chartData.temperatura1, 'rgb(75, 192, 192)')} options={createChartOptions('Temperatura (°C)')} />
            </div>
            <div className="graph-box">
                <Line data={createChartData('Temperatura Exterior', chartData.temperatura2, 'rgb(255, 99, 132)')} options={createChartOptions('Temperatura (°C)')} />
            </div>
            <div className="graph-box">
                <Line data={createChartData('Humedad del Suelo', chartData.humedadSuelo, 'rgb(54, 162, 235)')} options={createChartOptions('Humedad del Suelo (%)')} />
            </div>
        </div>
    );
};

export default SensorGraphs;
