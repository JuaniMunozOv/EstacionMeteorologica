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
  const [selectedGraphDayKey, setSelectedGraphDayKey] = useState(null);

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

  const todayDayKey = getDayKeyArgentina(Date.now());

  const todayExtremes = useMemo(
    () => dailyExtremes.find((d) => d.dayKey === todayDayKey) ?? dailyExtremes[0] ?? null,
    [dailyExtremes, todayDayKey]
  );

  const graphDayKey = useMemo(() => {
    if (selectedGraphDayKey) return selectedGraphDayKey;
    if (dailyExtremes.some((d) => d.dayKey === todayDayKey)) return todayDayKey;
    return dailyExtremes[0]?.dayKey ?? todayDayKey;
  }, [selectedGraphDayKey, dailyExtremes, todayDayKey]);

  const graphData = useMemo(
    () => filterRecordsForCalendarDay(historicalData, graphDayKey),
    [historicalData, graphDayKey]
  );

  const graphDayLabel = useMemo(() => {
    const day = dailyExtremes.find((d) => d.dayKey === graphDayKey);
    if (!day) return 'Día · 00:00–23:59';
    if (day.isToday) return `Hoy · 00:00–23:59 (${day.fechaCorta})`;
    return `${day.fechaCorta} · 00:00–23:59`;
  }, [dailyExtremes, graphDayKey]);

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
          today={todayExtremes}
          connectionState={connectionState}
        />
        <SensorGraphs
          data={graphData}
          connectionState={connectionState}
          dayLabel={graphDayLabel}
          days={dailyExtremes}
          selectedDayKey={graphDayKey}
          onSelectDay={setSelectedGraphDayKey}
        />
      </header>
    </div>
  );
}

export default App;
