import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import './SensorGraphs.css';

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

    useEffect(() => {
        const intervalId = setInterval(() => {
            const timestamp = new Date();
            fetch('https://estacionbackend.herokuapp.com/api/sensor-data')
                .then(response => response.json())
                .then(data => {
                    setChartData(prevData => ({
                        timestamps: [...prevData.timestamps, timestamp.toLocaleTimeString()],
                        temperatura1: [...prevData.temperatura1, data.temperatura1],
                        temperatura2: [...prevData.temperatura2, data.temperatura2],
                        humedadSuelo: [...prevData.humedadSuelo, data.humedadSuelo]
                    }));
                })
                .catch(error => {
                    console.error("Error fetching data: ", error);
                });
        }, 1800000);  // Actualiza cada 30 minutos

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
