import { DEFAULT_SETTINGS, Settings, settingsSchema } from '../types';

/**
 * Settings are stored as key/value string pairs in the Google Sheet's Config tab.
 */

export function settingsToRows(settings: Settings): [string, string][] {
  return [
    ['categories', JSON.stringify(settings.categories)],
    ['paymentModes', JSON.stringify(settings.paymentModes)],
    ['defaultCurrency', settings.defaultCurrency],
    ['monthlyBudget', String(settings.monthlyBudget)],
  ];
}

export function rowsToSettings(rows: (string | undefined)[][]): Settings {
  const map = new Map(rows.map((row) => [row[0], row[1] ?? '']));
  const tryJson = (value: string | undefined) => {
    if (!value) return undefined;
    try {
      return JSON.parse(value);
    } catch {
      return undefined;
    }
  };
  const parsed = settingsSchema.safeParse({
    categories: tryJson(map.get('categories')) ?? DEFAULT_SETTINGS.categories,
    paymentModes: tryJson(map.get('paymentModes')) ?? DEFAULT_SETTINGS.paymentModes,
    defaultCurrency: map.get('defaultCurrency') || DEFAULT_SETTINGS.defaultCurrency,
    monthlyBudget: map.get('monthlyBudget') || 0,
  });
  return parsed.success ? parsed.data : DEFAULT_SETTINGS;
}
