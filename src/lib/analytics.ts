import {
  eachDayOfInterval,
  endOfMonth,
  format,
  parseISO,
  startOfMonth,
  subDays,
  subMonths,
} from 'date-fns';
import type { Expense } from './types';

export type Period = 'this-month' | 'last-month' | '90-days' | 'this-year' | 'all';

export const PERIODS: { value: Period; label: string }[] = [
  { value: 'this-month', label: 'This month' },
  { value: 'last-month', label: 'Last month' },
  { value: '90-days', label: 'Last 90 days' },
  { value: 'this-year', label: 'This year' },
  { value: 'all', label: 'All time' },
];

export function periodRange(period: Period, now = new Date()): { from?: Date; to?: Date } {
  switch (period) {
    case 'this-month':
      return { from: startOfMonth(now), to: endOfMonth(now) };
    case 'last-month': {
      const lastMonth = subMonths(now, 1);
      return { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) };
    }
    case '90-days':
      return { from: subDays(now, 90), to: now };
    case 'this-year':
      return { from: new Date(now.getFullYear(), 0, 1), to: now };
    case 'all':
      return {};
  }
}

export function inPeriod(expense: Expense, period: Period, now = new Date()): boolean {
  const { from, to } = periodRange(period, now);
  const date = parseISO(expense.date);
  if (Number.isNaN(date.getTime())) return false;
  if (from && date < from) return false;
  if (to && date > to) return false;
  return true;
}

export function totalSpend(expenses: Expense[]): number {
  return expenses
    .filter((expense) => expense.type === 'expense')
    .reduce((sum, expense) => sum + expense.amount, 0);
}

export function totalIncome(expenses: Expense[]): number {
  return expenses
    .filter((expense) => expense.type === 'income')
    .reduce((sum, expense) => sum + expense.amount, 0);
}

export function byCategory(expenses: Expense[]): { category: string; total: number }[] {
  const totals = new Map<string, number>();
  for (const expense of expenses) {
    if (expense.type !== 'expense') continue;
    totals.set(expense.category, (totals.get(expense.category) ?? 0) + expense.amount);
  }
  return [...totals.entries()]
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);
}

/** Monthly spend series — used for long periods where daily bars get too dense. */
export function byMonth(expenses: Expense[]): { date: string; label: string; total: number }[] {
  const totals = new Map<string, number>();
  for (const expense of expenses) {
    if (expense.type !== 'expense' || !expense.month) continue;
    totals.set(expense.month, (totals.get(expense.month) ?? 0) + expense.amount);
  }
  return [...totals.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, total]) => {
      const parsed = parseISO(`${month}-01`);
      return {
        date: month,
        label: Number.isNaN(parsed.getTime()) ? month : format(parsed, 'MMM yy'),
        total,
      };
    });
}

/** Daily spend series over the period covered by the given expenses. */
export function byDay(
  expenses: Expense[],
  period: Period,
  now = new Date(),
): { date: string; label: string; total: number }[] {
  const spends = expenses.filter((expense) => expense.type === 'expense');
  if (spends.length === 0) return [];
  const { from, to } = periodRange(period, now);
  const dates = spends
    .map((expense) => parseISO(expense.date))
    .filter((date) => !Number.isNaN(date.getTime()));
  if (dates.length === 0) return [];
  const min = from ?? new Date(Math.min(...dates.map((date) => date.getTime())));
  const max = to ?? now;

  const totals = new Map<string, number>();
  for (const expense of spends) {
    totals.set(expense.date, (totals.get(expense.date) ?? 0) + expense.amount);
  }
  return eachDayOfInterval({ start: min, end: max }).map((day) => {
    const key = format(day, 'yyyy-MM-dd');
    return { date: key, label: format(day, 'd MMM'), total: totals.get(key) ?? 0 };
  });
}
