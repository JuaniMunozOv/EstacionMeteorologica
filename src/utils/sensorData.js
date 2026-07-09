export function getRecordTimestamp(key, record) {
  const candidates = [record?.timestamp, record?.fecha, record?.ts];
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
  if (!ms) return 'Sin fecha';
  return new Date(ms).toLocaleString('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    dateStyle: 'short',
    timeStyle: 'medium',
  });
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
