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
