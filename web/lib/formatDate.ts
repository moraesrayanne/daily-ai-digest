const MONTHS_LONG = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
const MONTHS_SHORT = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
const DAYS_SHORT = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];

export function formatDateLong(dateStr: string): string {
  const [, month, day] = dateStr.split('-').map(Number);
  return `${day} de ${MONTHS_LONG[month - 1]}`;
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00');
  const day = DAYS_SHORT[date.getDay()];
  const [, month, d] = dateStr.split('-').map(Number);
  return `${day}, ${d} ${MONTHS_SHORT[month - 1]}`;
}

export function formatSentAt(isoString: string): string {
  const d = new Date(isoString);
  const day = d.getDate();
  const month = MONTHS_SHORT[d.getMonth()];
  const year = d.getFullYear();
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  return `${day} ${month} ${year}, ${hours}:${minutes}`;
}

export function formatTimeOnly(isoString: string): string {
  const d = new Date(isoString);
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function isToday(dateStr: string): boolean {
  return dateStr === new Date().toISOString().slice(0, 10);
}
