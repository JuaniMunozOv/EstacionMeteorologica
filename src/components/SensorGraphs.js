import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import './SensorGraphs.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SensorGraphs = ({ data }) => {
    if (!data) {
        return <div>Cargando gráficos...</div>;
    }

    // Procesar los datos históricos que llegan desde App.js
    const labels = Object.values(data).map(record => new Date(record.timestamp).toLocaleTimeString());
    const tempData = Object.values(data).map(record => record.temperatura);
    const humedadData = Object.values(data).map(record => record.humedadAire);

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Temperatura',
                data: tempData,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Humedad Aire',
                data: humedadData,
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
            },
        ],
    };

    return (
        <div className="sensor-graphs-container">
            <div className="graph-box">
                <Line data={chartData} />
            </div>
        </div>
    );
};

export default SensorGraphs;
