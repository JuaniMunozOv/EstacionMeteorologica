import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from './firebase/firebaseConfig';
import './App.css';
import SensorDisplay from './components/SensorDisplay';
import SensorGraphs from './components/SensorGraphs';
import background from './assets/background.svg';

function App() {
  // Estado para los datos actuales (temperatura, humedad, etc.)
  const [currentData, setCurrentData] = useState(null);
  // Estado para los datos históricos (para los gráficos)
  const [historicalData, setHistoricalData] = useState(null);

  useEffect(() => {
    // 1. Escuchar los datos actuales
    const currentDataRef = ref(database, 'datos_actuales');
    const unsubscribeCurrent = onValue(currentDataRef, (snapshot) => {
      setCurrentData(snapshot.val());
    });

    // 2. Escuchar los datos históricos (si los tienes en otra ruta)
    //    Si no tienes datos históricos, puedes comentar o eliminar esta parte.
    //    Asumiré que tienes una ruta 'datos_historicos' para el ejemplo.
    const historicalDataRef = ref(database, 'datos_historicos');
    const unsubscribeHistorical = onValue(historicalDataRef, (snapshot) => {
      setHistoricalData(snapshot.val());
    });

    // Limpiar las suscripciones al desmontar el componente
    return () => {
      unsubscribeCurrent();
      unsubscribeHistorical();
    };
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
        {/* Pasamos los datos a los componentes hijos como props */}
        <SensorDisplay data={currentData} />
        <SensorGraphs data={historicalData} />
      </header>
    </div>
  );
}

export default App;
