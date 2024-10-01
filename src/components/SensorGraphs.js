import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import './SensorGraphs.css';

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
        const fetchData = async () => {
            try {
                setLoading(true);
                const docRef = doc(db, "sensores", "historico");
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setChartData({
                        timestamps: data.timestamps || [],
                        temperatura1: data.temperatura1 || [],
                        temperatura2: data.temperatura2 || [],
                        humedadSuelo: data.humedadSuelo || []
                    });
                } else {
                    console.log("No hay datos históricos disponibles.");
                }
                setLoading(false);
            } catch (error) {
                console.error("Error obteniendo los datos históricos:", error);
                setError("Error al obtener los datos históricos.");
                setLoading(false);
            }
        };

        fetchData();

        const intervalId = setInterval(fetchData, 1800000); // Actualizar cada 30 minutos
        return () => clearInterval(intervalId);
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
