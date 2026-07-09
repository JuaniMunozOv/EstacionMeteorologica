import React, { useEffect, useState } from 'react';
import './SensorDisplay.css';
import { formatRelativeSent } from '../utils/sensorData';

const statusMessage = {
  loading: 'Conectando con Firebase...',
  empty: 'Sin lecturas en Firebase (ruta sensores/)',
  error: 'No se pudo leer Firebase. Revisa reglas y conexion.',
  ready: null,
};

const SensorDisplay = ({ data, connectionState = 'loading' }) => {
  const [relativo, setRelativo] = useState('');

  useEffect(() => {
    if (!data?.enviadoTs) {
      setRelativo('');
      return undefined;
    }

    const update = () => setRelativo(formatRelativeSent(data.enviadoTs));
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, [data?.enviadoTs]);

  if (!data) {
    return (
      <div className="card-container">
        <div className="card status-card">
          <h2>{statusMessage[connectionState] || 'Conectando...'}</h2>
          <p className="data">--</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-container">
      <div className="card timestamp-card timestamp-card-top">
        <p className="timestamp-label">Ultimo dato enviado</p>
        {data.enviadoTs ? (
          <>
            <p className="timestamp-date">{data.fechaEnvio}</p>
            <p className="timestamp-time">
              {data.horaEnvio}
              {relativo ? <span className="timestamp-relative"> ({relativo})</span> : null}
            </p>
          </>
        ) : (
          <p className="timestamp-unknown">
            Fecha no disponible en este registro. Los nuevos envios del ESP32
            incluiran fecha y hora cuando lleguen a Firebase.
          </p>
        )}
      </div>

      <div className="card">
        <h2>Temp. Exterior</h2>
        <p className="data">{parseFloat(data.temperatura1).toFixed(1)} C</p>
      </div>
      <div className="card">
        <h2>Temp. Interior</h2>
        <p className="data">{parseFloat(data.temperatura2).toFixed(1)} C</p>
      </div>
      <div className="card">
        <h2>Humedad Aire</h2>
        <p className="data">{parseFloat(data.humedadAire).toFixed(1)} %</p>
      </div>
      <div className="card">
        <h2>Humedad Suelo</h2>
        <p className="data">{data.humedadSuelo} %</p>
      </div>
    </div>
  );
};

export default SensorDisplay;
