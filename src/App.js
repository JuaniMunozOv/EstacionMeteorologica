import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, query, limitToLast } from 'firebase/database';
import { database } from './firebase/firebaseConfig';
import './App.css';
import SensorDisplay from './components/SensorDisplay';
import SensorGraphs from './components/SensorGraphs';
import background from './assets/background.svg';

function App() {
  const [currentData, setCurrentData] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);

  useEffect(() => {
    const dataRef = ref(database, 'sensores');
    const historicalQuery = query(dataRef, limitToLast(20));

    const unsubscribe = onValue(historicalQuery, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setHistoricalData(data);

        const keys = Object.keys(data);
        const lastKey = keys[keys.length - 1];
        const lastRecord = data[lastKey];

        // --- CORRECCIÓN AQUÍ ---
        // Ahora pasamos todos los datos necesarios con sus nombres correctos
        const formattedData = {
          temperatura1: lastRecord.temperatura1, // Temperatura Exterior
          temperatura2: lastRecord.temperatura2, // Temperatura Interior
          humedadAire: lastRecord.humedad,
          humedadSuelo: lastRecord.humedadSuelo,
          ultimaLectura: new Date(parseInt(lastKey)).toLocaleString()
        };

        setCurrentData(formattedData);

      } else {
        console.log("No se encontraron datos en la ruta 'sensores'.");
      }
    });

    return () => unsubscribe();
  }, []);

  const backgroundStyle = {
    backgroundImage: `url(${background})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    width: '100%'
  };

  return (
    <div className="App">
      <header className="App-header" style={backgroundStyle}>
        <SensorDisplay data={currentData} />
        <SensorGraphs data={historicalData} />
      </header>
    </div>
  );
}

export default App;
