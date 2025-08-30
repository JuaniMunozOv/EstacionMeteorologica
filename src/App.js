import React, { useState, useEffect } from 'react';
// Importamos más funciones de Firebase para poder leer el último dato
import { getDatabase, ref, onValue, query, limitToLast } from 'firebase/database';
import { database } from './firebase/firebaseConfig'; // Asegúrate que la ruta sea correcta
import './App.css';
import SensorDisplay from './components/SensorDisplay';
import SensorGraphs from './components/SensorGraphs';
import background from './assets/background.svg';

function App() {
  const [sensorData, setSensorData] = useState(null);

  useEffect(() => {
    // 1. Apuntamos a la ruta 'sensores' que es la correcta
    const dataRef = ref(database, 'sensores');

    // 2. Creamos una consulta para obtener solo el último elemento
    const lastDataQuery = query(dataRef, limitToLast(1));

    const unsubscribe = onValue(lastDataQuery, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        // Como solo pedimos un dato, necesitamos extraerlo del objeto
        const lastKey = Object.keys(data)[0];
        const lastRecord = data[lastKey];

        console.log("Último dato recibido:", lastRecord);
        setSensorData(lastRecord);
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
        <SensorDisplay data={sensorData} />
        <SensorGraphs data={sensorData} />
      </header>
    </div>
  );
}

export default App;
