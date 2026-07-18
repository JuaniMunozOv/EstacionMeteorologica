export function getRecordTimestamp(key, record) {
  const candidates = [record?.timestamp, record?.fecha, record?.ts, record?.ts_ms];
  for (const value of candidates) {
    const n = Number(value);
    if (!Number.isNaN(n) && n > 1_000_000_000_000) return n;
    if (!Number.isNaN(n) && n > 1_000_000_000) return n * 1000;
  }

  const keyNum = Number(key);
  if (!Number.isNaN(keyNum) && keyNum > 1_000_000_000_000) return keyNum;

  return null;
}

export function formatDateTimeArgentina(ms) {
  const parts = formatSentDateTime(ms);
  return parts ? parts.full : 'Sin fecha';
}

export function formatSentDateTime(ms) {
  if (!ms) return null;

  const fecha = new Date(ms).toLocaleDateString('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const hora = new Date(ms).toLocaleTimeString('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const fechaCorta = new Date(ms).toLocaleDateString('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return {
    fecha,
    fechaCorta,
    hora,
    full: `${fechaCorta} ${hora}`,
  };
}

export function formatRelativeSent(ms) {
  if (!ms) return '';
  const diff = Date.now() - ms;
  if (diff < 0) return 'ahora';
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'hace un momento';
  if (mins === 1) return 'hace 1 minuto';
  if (mins < 60) return `hace ${mins} minutos`;
  const hours = Math.floor(mins / 60);
  if (hours === 1) return 'hace 1 hora';
  if (hours < 24) return `hace ${hours} horas`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'hace 1 dia';
  return `hace ${days} dias`;
}

export function getLatestRecord(data) {
  if (!data) return null;

  const entries = Object.entries(data).map(([key, record]) => ({
    key,
    record,
    ts: getRecordTimestamp(key, record) ?? 0,
  }));

  entries.sort((a, b) => a.ts - b.ts || a.key.localeCompare(b.key));
  return entries.length ? entries[entries.length - 1] : null;
}

export function sortRecordsByTime(data) {
  return Object.entries(data)
    .map(([key, record]) => ({
      key,
      record,
      ts: getRecordTimestamp(key, record) ?? 0,
    }))
    .sort((a, b) => a.ts - b.ts || a.key.localeCompare(b.key));
}

/** Día calendario en Argentina: YYYY-MM-DD */
export function getDayKeyArgentina(ms) {
  if (!ms) return null;
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(ms));
}

export function parseValidTemp(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  if (n <= -126 || n > 85) return null;
  return n;
}

function findExtremes(points) {
  if (!points.length) return null;
  let max = points[0];
  let min = points[0];
  for (let i = 1; i < points.length; i++) {
    const p = points[i];
    if (p.value > max.value) max = p;
    if (p.value < min.value) min = p;
  }
  return {
    max: { value: max.value, ts: max.ts },
    min: { value: min.value, ts: min.ts },
    samples: points.length,
  };
}

/**
 * Máx/mín por día (Argentina) para exterior e interior.
 * Devuelve días ordenados del más reciente al más antiguo.
 */
export function computeDailyTempExtremes(data) {
  const byDay = new Map();

  for (const [key, record] of Object.entries(data || {})) {
    const ts = getRecordTimestamp(key, record);
    if (!ts) continue;

    const dayKey = getDayKeyArgentina(ts);
    if (!dayKey) continue;

    if (!byDay.has(dayKey)) {
      byDay.set(dayKey, { exterior: [], interior: [] });
    }
    const bucket = byDay.get(dayKey);

    const t1 = parseValidTemp(record.temperatura1);
    const t2 = parseValidTemp(record.temperatura2);
    if (t1 != null) bucket.exterior.push({ value: t1, ts });
    if (t2 != null) bucket.interior.push({ value: t2, ts });
  }

  const todayKey = getDayKeyArgentina(Date.now());

  return [...byDay.entries()]
    .map(([dayKey, bucket]) => {
      const labelDate = new Date(`${dayKey}T12:00:00`);
      const fechaLarga = labelDate.toLocaleDateString('es-AR', {
        timeZone: 'America/Argentina/Buenos_Aires',
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
      const fechaCorta = dayKey.split('-').reverse().join('/');

      return {
        dayKey,
        fechaCorta,
        fechaLarga,
        isToday: dayKey === todayKey,
        exterior: findExtremes(bucket.exterior),
        interior: findExtremes(bucket.interior),
      };
    })
    .sort((a, b) => b.dayKey.localeCompare(a.dayKey));
}

/** Filtra registros de las últimas `hours` horas (para gráficos). */
export function filterRecordsLastHours(data, hours = 24) {
  if (!data) return null;
  const cutoff = Date.now() - hours * 60 * 60 * 1000;
  const filtered = {};
  for (const [key, record] of Object.entries(data)) {
    const ts = getRecordTimestamp(key, record);
    if (ts && ts >= cutoff) filtered[key] = record;
  }
  return Object.keys(filtered).length ? filtered : null;
}
