import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import './SensorGraphs.css';

// Registramos los componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SensorGraphs = ({ data }) => {
    // Si los datos aún no han llegado, muestra un mensaje de carga
    if (!data) {
        return <div>Cargando gráficos...</div>;
    }

    // Procesamos los datos históricos para crear las etiquetas y los valores de los gráficos
    const labels = Object.keys(data).map(key => new Date(parseInt(key)).toLocaleTimeString());
    const temperatura1Data = Object.values(data).map(record => record.temperatura1);
    const temperatura2Data = Object.values(data).map(record => record.temperatura2);
    const humedadSueloData = Object.values(data).map(record => record.humedadSuelo);

    // Creamos la configuración para cada uno de los tres gráficos
    const temp1ChartData = {
        labels,
        datasets: [{
            label: 'Temperatura 1 (°C)',
            data: temperatura1Data,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        }],
    };

    const temp2ChartData = {
        labels,
        datasets: [{
            label: 'Temperatura 2 (°C)',
            data: temperatura2Data,
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
        }],
    };

    const humedadSueloChartData = {
        labels,
        datasets: [{
            label: 'Humedad Suelo (%)',
            data: humedadSueloData,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
        }],
    };

    return (
        <div className="sensor-graphs-container">
            <div className="graph-box">
                <h3>Temperatura 1</h3>
                <Line data={temp1ChartData} />
            </div>
            <div className="graph-box">
                <h3>Temperatura 2</h3>
                <Line data={temp2ChartData} />
            </div>
            <div className="graph-box">
                <h3>Humedad del Suelo</h3>
                <Line data={humedadSueloChartData} />
            </div>
        </div>
    );
};

export default SensorGraphs;
