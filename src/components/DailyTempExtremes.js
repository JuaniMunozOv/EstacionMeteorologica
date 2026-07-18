import React, { useMemo, useState } from 'react';
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
        <p className="extreme-samples">{extremes.samples} lecturas del día</p>
      ) : null}
    </div>
  );
}

const DailyTempExtremes = ({ days, connectionState = 'loading' }) => {
  const [selectedKey, setSelectedKey] = useState(null);

  const selected = useMemo(() => {
    if (!days?.length) return null;
    if (selectedKey) {
      return days.find((d) => d.dayKey === selectedKey) || days[0];
    }
    return days.find((d) => d.isToday) || days[0];
  }, [days, selectedKey]);

  if (!days?.length) {
    const message =
      connectionState === 'error'
        ? 'No se pudieron calcular extremos'
        : connectionState === 'empty'
          ? 'Aún no hay historial por día'
          : 'Calculando máximos y mínimos...';
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
            <p className="daily-kicker">Historial diario</p>
            <h3>Máximas y mínimas por día</h3>
            <p className="daily-sub">
              Cada valor muestra la temperatura y la hora exacta en que se registró
              (hora Argentina).
            </p>
          </div>
        </header>

        <div className="day-chips" role="tablist" aria-label="Elegir día">
          {days.map((day) => {
            const active = selected?.dayKey === day.dayKey;
            return (
              <button
                key={day.dayKey}
                type="button"
                role="tab"
                aria-selected={active}
                className={`day-chip${active ? ' active' : ''}${day.isToday ? ' today' : ''}`}
                onClick={() => setSelectedKey(day.dayKey)}
              >
                <span className="day-chip-label">
                  {day.isToday ? 'Hoy' : day.fechaCorta}
                </span>
                {day.isToday ? (
                  <span className="day-chip-sub">{day.fechaCorta}</span>
                ) : null}
              </button>
            );
          })}
        </div>

        {selected ? (
          <div className="day-panel">
            <p className="day-panel-title">
              {selected.isToday ? 'Hoy · ' : ''}
              {selected.fechaLarga}
            </p>
            <div className="thermo-grid">
              <ThermoCard
                title="Termómetro exterior"
                accent="exterior"
                extremes={selected.exterior}
              />
              <ThermoCard
                title="Termómetro interior"
                accent="interior"
                extremes={selected.interior}
              />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default DailyTempExtremes;
