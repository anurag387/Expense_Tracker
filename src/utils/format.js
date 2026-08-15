export function formatCurrency(amount, { sign = false } = {}) {
  const value = Number(amount) || 0;
  const abs = Math.abs(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const prefix = sign ? (value < 0 ? '-' : value > 0 ? '+' : '') : value < 0 ? '-' : '';
  return `${prefix}\u09F3${abs}`;
}

export function formatDate(dateStr, lang = 'en') {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function monthLabel(monthIndex, lang = 'en') {
  const d = new Date(2024, monthIndex, 1);
  return d.toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', { month: 'short' });
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
