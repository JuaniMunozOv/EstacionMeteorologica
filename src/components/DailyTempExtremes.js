import React from 'react';
import './DailyTempExtremes.css';
import { formatSentDateTime } from '../utils/sensorData';

function formatTemp(value) {
  if (value == null || Number.isNaN(Number(value))) return '--';
  return `${Number(value).toFixed(1)} °C`;
}

function ExtremeBlock({ kind, extreme }) {
  if (!extreme) {
    return (
      <div className={`extreme-block extreme-${kind} extreme-empty`}>
        <span className="extreme-badge">{kind === 'max' ? 'Máxima' : 'Mínima'}</span>
        <p className="extreme-value">Sin datos</p>
      </div>
    );
  }

  const when = formatSentDateTime(extreme.ts);

  return (
    <div className={`extreme-block extreme-${kind}`}>
      <span className="extreme-badge">{kind === 'max' ? '↑ Máxima' : '↓ Mínima'}</span>
      <p className="extreme-value">{formatTemp(extreme.value)}</p>
      <p className="extreme-when">
        {when ? (
          <>
            <span className="extreme-date">{when.fechaCorta}</span>
            <span className="extreme-time">{when.hora?.slice(0, 5)}</span>
          </>
        ) : (
          'Sin fecha'
        )}
      </p>
    </div>
  );
}

function ThermoCard({ title, accent, extremes }) {
  return (
    <div className={`thermo-card thermo-${accent}`}>
      <h4>{title}</h4>
      <div className="extreme-pair">
        <ExtremeBlock kind="max" extreme={extremes?.max} />
        <ExtremeBlock kind="min" extreme={extremes?.min} />
      </div>
      {extremes?.samples ? (
        <p className="extreme-samples">{extremes.samples} lecturas de hoy</p>
      ) : null}
    </div>
  );
}

const DailyTempExtremes = ({ today, connectionState = 'loading' }) => {
  if (!today) {
    const message =
      connectionState === 'error'
        ? 'No se pudieron calcular extremos'
        : connectionState === 'empty'
          ? 'Aún no hay lecturas de hoy'
          : 'Calculando máximos y mínimos de hoy...';
    return (
      <section className="daily-extremes">
        <div className="daily-extremes-inner daily-extremes-status">
          <p>{message}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="daily-extremes">
      <div className="daily-extremes-inner">
        <header className="daily-extremes-header">
          <div>
            <p className="daily-kicker">Hoy · se actualiza con cada envío</p>
            <h3>Máximas y mínimas del día</h3>
            <p className="daily-sub">
              Temperatura y hora exacta de cada extremo (Argentina).
              Se recalcula cada ~5 min cuando llega un dato nuevo del ESP32.
            </p>
          </div>
        </header>

        <div className="day-panel">
          <p className="day-panel-title">Hoy · {today.fechaLarga}</p>
          <div className="thermo-grid">
            <ThermoCard
              title="Termómetro exterior"
              accent="exterior"
              extremes={today.exterior}
            />
            <ThermoCard
              title="Termómetro interior"
              accent="interior"
              extremes={today.interior}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DailyTempExtremes;
