import React from 'react';
import './SensorDisplay.css'; // Asegúrate de tener un archivo CSS para los estilos

// El componente recibe 'data' como una "prop" desde App.js.
// No necesita conectarse a Firebase por sí mismo.
const SensorDisplay = ({ data }) => {
  
  // Si 'data' todavía no ha llegado desde App.js, mostramos un mensaje de carga.
  if (!data) {
    return (
      <div className="card-container">
        <div className="card">
          <h2>Conectando a los sensores...</h2>
          <p className="data">--</p>
        </div>
      </div>
    );
  }

  // Una vez que 'data' llega, mostramos los valores.
  // Usamos los nombres correctos que envía el ESP32: 'temperatura', 'humedadAire', etc.
  return (
    <div className="card-container">
      <div className="card">
        <h2>🌡️ Temperatura</h2>
        <p className="data">{parseFloat(data.temperatura).toFixed(1)}°C</p>
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
