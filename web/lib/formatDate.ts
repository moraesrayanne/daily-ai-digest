const MONTHS_LONG = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
export const MONTHS_SHORT = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
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

function toBRT(isoString: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date(isoString));
}

export function formatSentAt(isoString: string): string {
  const parts = toBRT(isoString);
  const get = (type: string) => parts.find(p => p.type === type)?.value ?? '';
  const monthIndex = parseInt(get('month'), 10) - 1;
  return `${parseInt(get('day'), 10)} ${MONTHS_SHORT[monthIndex]} ${get('year')}, ${get('hour')}:${get('minute')}`;
}

export function formatArticleDate(isoString: string): string {
  const parts = toBRT(isoString);
  const get = (type: string) => parts.find(p => p.type === type)?.value ?? '';
  const monthIndex = parseInt(get('month'), 10) - 1;
  return `${parseInt(get('day'), 10)} ${MONTHS_SHORT[monthIndex]} ${get('year')}, ${get('hour')}:${get('minute')}`;
}

export function formatTimeOnly(isoString: string): string {
  const parts = toBRT(isoString);
  const get = (type: string) => parts.find(p => p.type === type)?.value ?? '';
  return `${get('hour')}:${get('minute')}`;
}

export function isToday(dateStr: string): boolean {
  return dateStr === new Date().toISOString().slice(0, 10);
}
