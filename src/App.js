import React from 'react';
import './App.css';
import SensorDisplay from './SensorDisplay';
import SensorGraphs from './SensorGraphs'; 
import background from './assets/background.svg';

function App() {
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
        <SensorDisplay />
        <SensorGraphs />
      </header>
    </div>
  );
}

export default App;
