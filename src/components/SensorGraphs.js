import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import './SensorGraphs.css';

// Registramos los componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SensorGraphs = ({ data }) => {
    // Si los datos aún no han llegado, muestra un mensaje de carga
    if (!data) {
        return <div style={{ color: 'white', opacity: 0.9, padding: 16 }}>Cargando gráficos...</div>;
    }

    // Procesamos los datos históricos para crear las etiquetas y los valores de los gráficos
    const labels = Object.keys(data).map(key => new Date(parseInt(key)).toLocaleTimeString());
    const temperatura1Data = Object.values(data).map(record => record.temperatura1);
    const temperatura2Data = Object.values(data).map(record => record.temperatura2);
    const humedadSueloData = Object.values(data).map(record => record.humedadSuelo);

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: { color: 'rgba(255,255,255,0.9)', boxWidth: 10, boxHeight: 10, usePointStyle: true }
            },
            tooltip: {
                enabled: true,
                callbacks: {
                    label: (ctx) => {
                        const v = ctx.parsed?.y;
                        return `${ctx.dataset.label}: ${typeof v === 'number' ? v.toFixed(1) : v}`;
                    }
                }
            }
        },
        scales: {
            x: {
                ticks: { color: 'rgba(255,255,255,0.75)', maxTicksLimit: 6 },
                grid: { color: 'rgba(255,255,255,0.08)' }
            },
            y: {
                ticks: { color: 'rgba(255,255,255,0.75)' },
                grid: { color: 'rgba(255,255,255,0.08)' }
            }
        }
    };

    // Creamos la configuración para cada uno de los tres gráficos
    const temp1ChartData = {
        labels,
        datasets: [{
            label: 'Temp. exterior (°C)',
            data: temperatura1Data,
            borderColor: 'rgba(255, 99, 132, 0.95)',
            backgroundColor: 'rgba(255, 99, 132, 0.15)',
            tension: 0.25,
            pointRadius: 0,
        }],
    };

    const temp2ChartData = {
        labels,
        datasets: [{
            label: 'Temp. interior (°C)',
            data: temperatura2Data,
            borderColor: 'rgba(54, 162, 235, 0.95)',
            backgroundColor: 'rgba(54, 162, 235, 0.15)',
            tension: 0.25,
            pointRadius: 0,
        }],
    };

    const humedadSueloChartData = {
        labels,
        datasets: [{
            label: 'Humedad Suelo (%)',
            data: humedadSueloData,
            borderColor: 'rgba(75, 192, 192, 0.95)',
            backgroundColor: 'rgba(75, 192, 192, 0.15)',
            tension: 0.25,
            pointRadius: 0,
        }],
    };

    return (
        <div className="sensor-graphs-container">
            <div className="graph-box">
                <h3>Temperatura exterior</h3>
                <div className="chart-wrap">
                    <Line data={temp1ChartData} options={commonOptions} />
                </div>
            </div>
            <div className="graph-box">
                <h3>Temperatura interior</h3>
                <div className="chart-wrap">
                    <Line data={temp2ChartData} options={commonOptions} />
                </div>
            </div>
            <div className="graph-box">
                <h3>Humedad del Suelo</h3>
                <div className="chart-wrap">
                    <Line data={humedadSueloChartData} options={commonOptions} />
                </div>
            </div>
        </div>
    );
};

export default SensorGraphs;
