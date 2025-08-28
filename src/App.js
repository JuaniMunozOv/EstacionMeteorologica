import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
// Ajustamos la ruta para que coincida con tu estructura de carpetas
import { database } from './firebase/firebaseConfig';
import './App.css';
import SensorDisplay from './components/SensorDisplay';
import SensorGraphs from './components/SensorGraphs';
import background from './assets/background.svg';

function App() {
  const [sensorData, setSensorData] = useState(null);

  useEffect(() => {
    const sensorDataRef = ref(database, 'datos_actuales');
    
    const unsubscribe = onValue(sensorDataRef, (snapshot) => {
      const data = snapshot.val();
      console.log("Datos recibidos de Realtime Database:", data);
      setSensorData(data);
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
