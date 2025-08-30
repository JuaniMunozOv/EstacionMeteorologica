import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from './firebase/firebaseConfig'; // Asegúrate que la ruta sea correcta
import './App.css';
import SensorDisplay from './components/SensorDisplay';
import SensorGraphs from './components/SensorGraphs';
import background from './assets/background.svg';

function App() {
  // Usaremos un solo estado para todos los datos de los sensores
  const [sensorData, setSensorData] = useState(null);

  useEffect(() => {
    // Escuchamos únicamente en la ruta donde el ESP32 envía los datos
    const dataRef = ref(database, 'datos_actuales');

    const unsubscribe = onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      console.log("Datos recibidos:", data);
      setSensorData(data); // Actualizamos el estado con los datos recibidos
    });

    // Limpiamos la suscripción al desmontar el componente
    return () => unsubscribe();
  }, []); // El array vacío asegura que esto se ejecute solo una vez

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
        {/* Pasamos los mismos datos a ambos componentes */}
        <SensorDisplay data={sensorData} />
        <SensorGraphs data={sensorData} />
      </header>
    </div>
  );
}

export default App;
