const MIN_LEAD_DAYS = 2;
const MAX_LEAD_DAYS = 90;

function toDateOnly(date) {
  return date.toISOString().split('T')[0];
}

export function getMinDeliveryDate() {
  const date = new Date();
  date.setDate(date.getDate() + MIN_LEAD_DAYS);
  return toDateOnly(date);
}

export function getMaxDeliveryDate() {
  const date = new Date();
  date.setDate(date.getDate() + MAX_LEAD_DAYS);
  return toDateOnly(date);
}

export function isValidDeliveryDate(value) {
  if (!value) return true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const selected = new Date(`${value}T12:00:00`);
  const min = new Date(`${getMinDeliveryDate()}T00:00:00`);
  const max = new Date(`${getMaxDeliveryDate()}T23:59:59`);

  return selected >= min && selected <= max;
}

export function formatDeliveryDate(value) {
  if (!value) return '';
  return new Date(`${value}T12:00:00`).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
