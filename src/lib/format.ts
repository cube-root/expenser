import { format, parseISO, isValid } from 'date-fns';

export function formatAmount(amount: number, currency: string): string {
  const formatted = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${currency}${formatted}`;
}

export function formatDate(date: string): string {
  const parsed = parseISO(date);
  return isValid(parsed) ? format(parsed, 'd MMM yyyy') : date;
}

export function todayISO(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function currentMonth(): string {
  return format(new Date(), 'yyyy-MM');
}

export function monthLabel(month: string): string {
  const parsed = parseISO(`${month}-01`);
  return isValid(parsed) ? format(parsed, 'MMMM yyyy') : month;
}
