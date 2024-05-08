import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SensorDisplay.css';

const SensorDisplay = () => {
    const [sensorData, setSensorData] = useState({
        temperatura1: null,
        temperatura2: null,
        humedad: null,
        humedadSuelo: null,
        indiceDeCalor: null
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Cambiar la URL a la del backend en Heroku
                const response = await axios.get('https://estacionbackend.herokuapp.com/api/sensor-data');

                setSensorData(response.data);
            } catch (error) {
                console.error('Error al obtener los datos de los sensores:', error);
            }
        };

        const intervalId = setInterval(fetchData, 5000); // Fetch data every 5 seconds
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="sensor-grid">
            <div className="sensor-box">Termómetro Interior: {sensorData.temperatura1} °C</div>
            <div className="sensor-box">Termómetro Exterior: {sensorData.temperatura2} °C</div>
            <div className="sensor-box">Humedad: {sensorData.humedad} %</div>
            <div className="sensor-box">Humedad de Suelo: {sensorData.humedadSuelo} %</div>
            <div className="sensor-box">Índice de Calor: {sensorData.indiceDeCalor} °C</div>
        </div>
    );
};

export default SensorDisplay;
