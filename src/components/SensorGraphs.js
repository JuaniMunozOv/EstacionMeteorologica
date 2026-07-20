import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import './SensorGraphs.css';
import { formatDateTimeArgentina, sortRecordsByTime } from '../utils/sensorData';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SensorGraphs = ({
    data,
    connectionState = 'loading',
    dayLabel = 'Hoy · 00:00–23:59',
    days = [],
    selectedDayKey,
    onSelectDay,
}) => {
    const dayChips = days?.length ? (
        <div className="graph-day-chips" role="tablist" aria-label="Elegir día del gráfico">
            {days.map((day) => {
                const active = selectedDayKey === day.dayKey;
                return (
                    <button
                        key={day.dayKey}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        className={`graph-day-chip${active ? ' active' : ''}${day.isToday ? ' today' : ''}`}
                        onClick={() => onSelectDay?.(day.dayKey)}
                    >
                        {day.isToday ? 'Hoy' : day.fechaCorta}
                    </button>
                );
            })}
        </div>
    ) : null;

    if (!data) {
        const message = connectionState === 'error'
            ? 'Error al cargar gráficos'
            : connectionState === 'empty'
                ? 'Sin datos históricos'
                : connectionState === 'ready'
                    ? 'Sin lecturas para este día (00:00–23:59)'
                    : 'Cargando gráficos...';
        return (
            <div className="sensor-graphs-section">
                {dayChips}
                <div style={{ color: 'white', opacity: 0.9, padding: 16 }}>{message}</div>
            </div>
        );
    }

    const sorted = sortRecordsByTime(data);
    const labels = sorted.map(({ key, ts }) =>
        ts ? formatDateTimeArgentina(ts).split(' ').slice(-1)[0] : key
    );
    const temperatura1Data = sorted.map(({ record }) => record.temperatura1);
    const temperatura2Data = sorted.map(({ record }) => record.temperatura2);
    const humedadAireData = sorted.map(({ record }) => record.humedad);

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
                    title: (items) => {
                        const idx = items[0]?.dataIndex;
                        const entry = sorted[idx];
                        return entry?.ts ? formatDateTimeArgentina(entry.ts) : entry?.key;
                    },
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

    const humedadAireChartData = {
        labels,
        datasets: [{
            label: 'Humedad aire (%)',
            data: humedadAireData,
            borderColor: 'rgba(75, 192, 192, 0.95)',
            backgroundColor: 'rgba(75, 192, 192, 0.15)',
            tension: 0.25,
            pointRadius: 0,
        }],
    };

    return (
        <div className="sensor-graphs-section">
            {dayChips}
            <div className="sensor-graphs-container">
            <div className="graph-box">
                <h3>Temperatura exterior</h3>
                <p className="graph-hint">{dayLabel}</p>
                <div className="chart-wrap">
                    <Line data={temp1ChartData} options={commonOptions} />
                </div>
            </div>
            <div className="graph-box">
                <h3>Temperatura interior</h3>
                <p className="graph-hint">{dayLabel}</p>
                <div className="chart-wrap">
                    <Line data={temp2ChartData} options={commonOptions} />
                </div>
            </div>
            <div className="graph-box">
                <h3>Humedad del aire</h3>
                <p className="graph-hint">{dayLabel}</p>
                <div className="chart-wrap">
                    <Line data={humedadAireChartData} options={commonOptions} />
                </div>
            </div>
            </div>
        </div>
    );
};

export default SensorGraphs;
