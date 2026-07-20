import React, { useMemo, useState, useEffect } from 'react';
import { ref, onValue, query, limitToLast } from 'firebase/database';
import { database } from './firebase/firebaseConfig';
import './App.css';
import SensorDisplay from './components/SensorDisplay';
import SensorGraphs from './components/SensorGraphs';
import DailyTempExtremes from './components/DailyTempExtremes';
import background from './assets/background.svg';
import {
  computeDailyTempExtremes,
  filterRecordsForCalendarDay,
  formatSentDateTime,
  getDayKeyArgentina,
  getLatestRecord,
  getRecordTimestamp,
} from './utils/sensorData';

// ~5 min por lectura → ~288/día. 2500 ≈ 8–9 días de historial.
const HISTORY_LIMIT = 2500;

function App() {
  const [currentData, setCurrentData] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const [connectionState, setConnectionState] = useState('loading');
  const [selectedDayKey, setSelectedDayKey] = useState(null);

  useEffect(() => {
    const dataRef = ref(database, 'sensores');
    const historicalQuery = query(dataRef, limitToLast(HISTORY_LIMIT));

    const unsubscribe = onValue(
      historicalQuery,
      (snapshot) => {
        if (!snapshot.exists()) {
          setCurrentData(null);
          setHistoricalData(null);
          setConnectionState('empty');
          return;
        }

        const data = snapshot.val();
        setHistoricalData(data);

        const latest = getLatestRecord(data);
        if (!latest) {
          setConnectionState('empty');
          return;
        }

        const { record } = latest;
        const ts = getRecordTimestamp(latest.key, record);
        const sentAt = formatSentDateTime(ts);

        setCurrentData({
          temperatura1: record.temperatura1,
          temperatura2: record.temperatura2,
          humedadAire: record.humedad,
          enviadoTs: ts,
          fechaEnvio: sentAt?.fecha ?? null,
          horaEnvio: sentAt?.hora ?? null,
        });
        setConnectionState('ready');
      },
      (error) => {
        console.error('Error leyendo Firebase:', error);
        setConnectionState('error');
      }
    );

    return () => unsubscribe();
  }, []);

  const dailyExtremes = useMemo(
    () => computeDailyTempExtremes(historicalData),
    [historicalData]
  );

  const activeDayKey = useMemo(() => {
    if (selectedDayKey) return selectedDayKey;
    const today = getDayKeyArgentina(Date.now());
    if (dailyExtremes.some((d) => d.dayKey === today)) return today;
    return dailyExtremes[0]?.dayKey ?? today;
  }, [selectedDayKey, dailyExtremes]);

  const graphData = useMemo(
    () => filterRecordsForCalendarDay(historicalData, activeDayKey),
    [historicalData, activeDayKey]
  );

  const graphDayLabel = useMemo(() => {
    const day = dailyExtremes.find((d) => d.dayKey === activeDayKey);
    if (!day) return 'Día · 00:00–23:59';
    if (day.isToday) return `Hoy · 00:00–23:59 (${day.fechaCorta})`;
    return `${day.fechaCorta} · 00:00–23:59`;
  }, [dailyExtremes, activeDayKey]);

  const backgroundStyle = {
    backgroundImage: `url(${background})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    width: '100%',
  };

  return (
    <div className="App">
      <header className="App-header" style={backgroundStyle}>
        <SensorDisplay data={currentData} connectionState={connectionState} />
        <DailyTempExtremes
          days={dailyExtremes}
          connectionState={connectionState}
          selectedDayKey={activeDayKey}
          onSelectDay={setSelectedDayKey}
        />
        <SensorGraphs
          data={graphData}
          connectionState={connectionState}
          dayLabel={graphDayLabel}
        />
      </header>
    </div>
  );
}

export default App;
