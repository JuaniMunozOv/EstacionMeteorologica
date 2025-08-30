import React from 'react';
import './SensorDisplay.css';

const SensorDisplay = ({ data }) => {
  if (!data) {
    return (
      <div className="card-container">
        <div className="card">
          <h2>Conectando...</h2>
          <p className="data">--</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-container">
      {/* --- CORRECCIÓN AQUÍ --- */}
      <div className="card">
        <h2>🌡️ Temp. Exterior</h2>
        <p className="data">{parseFloat(data.temperatura1).toFixed(1)}°C</p>
      </div>
      <div className="card">
        <h2>🏠 Temp. Interior</h2>
        <p className="data">{parseFloat(data.temperatura2).toFixed(1)}°C</p>
      </div>
      <div className="card">
        <h2>💧 Humedad Aire</h2>
        <p className="data">{parseFloat(data.humedadAire).toFixed(1)}%</p>
      </div>
      <div className="card">
        <h2>🌱 Humedad Suelo</h2>
        <p className="data">{data.humedadSuelo}%</p>
      </div>
      <div className="timestamp-card">
        <p>Última actualización: <span>{data.ultimaLectura}</span></p>
      </div>
    </div>
  );
};

export default SensorDisplay;
