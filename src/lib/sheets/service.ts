import { randomUUID } from 'crypto';
import { sheetsApi, driveApi, GoogleApiError } from './client';
import {
  DEFAULT_SETTINGS,
  Expense,
  NewExpense,
  Settings,
  SheetInfo,
  expenseSchema,
} from '../types';
import { rowsToSettings, settingsToRows } from '../storage/settings-codec';

export const EXPENSES_TAB = 'Expenses';
export const CONFIG_TAB = 'Config';

export const HEADERS = [
  'Id',
  'CreatedAt',
  'Date',
  'Month',
  'Amount',
  'Currency',
  'Category',
  'Type',
  'PaymentMode',
  'Note',
  'Tags',
  'Source',
  'SplitTotal',
  'SplitWith',
] as const;

const LAST_COLUMN = 'N'; // must match HEADERS length
const DATA_RANGE = `${EXPENSES_TAB}!A2:${LAST_COLUMN}`;

export function extractSpreadsheetId(input: string): string | null {
  const trimmed = input.trim();
  const fromUrl = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (fromUrl) return fromUrl[1];
  if (/^[a-zA-Z0-9-_]{20,}$/.test(trimmed)) return trimmed; // bare id pasted
  return null;
}

export function sheetUrl(spreadsheetId: string): string {
  return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
}

function expenseToRow(expense: Expense): (string | number)[] {
  return [
    expense.id,
    expense.createdAt,
    expense.date,
    expense.month,
    expense.amount,
    expense.currency,
    expense.category,
    expense.type,
    expense.paymentMode,
    expense.note,
    expense.tags,
    expense.source,
    expense.splitTotal > 0 ? expense.splitTotal : '',
    expense.splitWith,
  ];
}

function rowToExpense(row: string[]): Expense | null {
  if (!row[0]) return null; // no id → blank/garbage row
  const parsed = expenseSchema.safeParse({
    id: row[0],
    createdAt: row[1] ?? '',
    date: row[2] ?? '',
    month: row[3] ?? '',
    amount: row[4] ?? '0',
    currency: row[5] || '$',
    category: row[6] || 'Other',
    type: row[7] === 'income' ? 'income' : 'expense',
    paymentMode: row[8] ?? '',
    note: row[9] ?? '',
    tags: row[10] ?? '',
    source: row[11] || 'web',
    splitTotal: row[12] || '0',
    splitWith: row[13] ?? '',
  });
  return parsed.success ? parsed.data : null;
}

/** Create a fresh, fully structured expense spreadsheet in the user's Drive. */
export async function createExpenseSheet(token: string): Promise<SheetInfo> {
  const created = await sheetsApi.createSpreadsheet(token, {
    properties: { title: 'MyExpense Tracker' },
    sheets: [
      {
        properties: { title: EXPENSES_TAB, gridProperties: { frozenRowCount: 1 } },
      },
      { properties: { title: CONFIG_TAB, hidden: true } },
    ],
  });
  const spreadsheetId = created.spreadsheetId;
  await sheetsApi.updateValues(token, spreadsheetId, `${EXPENSES_TAB}!A1:${LAST_COLUMN}1`, [
    [...HEADERS],
  ]);
  await sheetsApi.updateValues(token, spreadsheetId, `${CONFIG_TAB}!A1:B5`, [
    ['Key', 'Value'],
    ...settingsToRows(DEFAULT_SETTINGS),
  ]);
  return {
    spreadsheetId,
    title: created.properties?.title ?? 'MyExpense Tracker',
    url: created.spreadsheetUrl ?? sheetUrl(spreadsheetId),
  };
}

/**
 * Connect an existing spreadsheet: verify access and make sure the
 * Expenses/Config tabs, headers and default settings are in place.
 * Never touches tabs it does not own, and never data rows.
 * `forceHeaders` rewrites the header row unconditionally (used by resync
 * after the app's schema gains columns or headings were hand-edited).
 */
export async function connectSheet(
  token: string,
  spreadsheetId: string,
  options?: { forceHeaders?: boolean },
): Promise<SheetInfo> {
  const meta = await sheetsApi.getMeta(token, spreadsheetId);
  const tabs = new Map(meta.sheets.map((sheet) => [sheet.properties.title, sheet.properties]));

  const addSheetRequests: unknown[] = [];
  if (!tabs.has(EXPENSES_TAB)) {
    addSheetRequests.push({
      addSheet: { properties: { title: EXPENSES_TAB, gridProperties: { frozenRowCount: 1 } } },
    });
  }
  if (!tabs.has(CONFIG_TAB)) {
    addSheetRequests.push({ addSheet: { properties: { title: CONFIG_TAB, hidden: true } } });
  }
  if (addSheetRequests.length > 0) {
    await sheetsApi.batchUpdate(token, spreadsheetId, addSheetRequests);
  }

  // Ensure the header row is present and current (covers sheets created
  // before new columns were added); never clobbers existing data rows.
  const headerRow = await sheetsApi.getValues(token, spreadsheetId, `${EXPENSES_TAB}!A1:${LAST_COLUMN}1`);
  if (
    options?.forceHeaders ||
    !headerRow[0] ||
    headerRow[0][0] !== HEADERS[0] ||
    headerRow[0].length < HEADERS.length
  ) {
    await sheetsApi.updateValues(token, spreadsheetId, `${EXPENSES_TAB}!A1:${LAST_COLUMN}1`, [
      [...HEADERS],
    ]);
  }

  // Seed config defaults if the Config tab is empty/new.
  const configRows = await sheetsApi.getValues(token, spreadsheetId, `${CONFIG_TAB}!A1:B10`);
  if (configRows.length <= 1) {
    await sheetsApi.updateValues(token, spreadsheetId, `${CONFIG_TAB}!A1:B5`, [
      ['Key', 'Value'],
      ...settingsToRows(DEFAULT_SETTINGS),
    ]);
  }

  return {
    spreadsheetId,
    title: meta.properties.title,
    url: sheetUrl(spreadsheetId),
  };
}

/** Re-run the structure ensure on an already-connected sheet, forcing the
 * canonical header row (safe: data rows are untouched). */
export function resyncSheet(token: string, spreadsheetId: string): Promise<SheetInfo> {
  return connectSheet(token, spreadsheetId, { forceHeaders: true });
}

export async function getSheetInfo(token: string, spreadsheetId: string): Promise<SheetInfo> {
  const meta = await sheetsApi.getMeta(token, spreadsheetId);
  return { spreadsheetId, title: meta.properties.title, url: sheetUrl(spreadsheetId) };
}

export async function discoverSheets(token: string) {
  const { files } = await driveApi.listAppSpreadsheets(token);
  return files.map((file) => ({
    spreadsheetId: file.id,
    title: file.name,
    url: sheetUrl(file.id),
    modifiedTime: file.modifiedTime,
  }));
}

export async function readSettings(token: string, spreadsheetId: string): Promise<Settings> {
  const rows = await sheetsApi.getValues(token, spreadsheetId, `${CONFIG_TAB}!A2:B20`);
  return rowsToSettings(rows);
}

export async function writeSettings(
  token: string,
  spreadsheetId: string,
  settings: Settings,
): Promise<void> {
  await sheetsApi.clearValues(token, spreadsheetId, `${CONFIG_TAB}!A2:B20`);
  await sheetsApi.updateValues(
    token,
    spreadsheetId,
    `${CONFIG_TAB}!A2:B${1 + settingsToRows(settings).length}`,
    settingsToRows(settings),
  );
}

export async function listExpenses(token: string, spreadsheetId: string): Promise<Expense[]> {
  const rows = await sheetsApi.getValues(token, spreadsheetId, DATA_RANGE);
  return rows.map(rowToExpense).filter((expense): expense is Expense => expense !== null);
}

export async function appendExpense(
  token: string,
  spreadsheetId: string,
  input: NewExpense,
  source = 'web',
): Promise<Expense> {
  const expense: Expense = {
    ...input,
    note: input.note ?? '',
    tags: input.tags ?? '',
    paymentMode: input.paymentMode ?? '',
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    month: input.date.slice(0, 7),
    source,
  };
  await sheetsApi.appendValues(token, spreadsheetId, DATA_RANGE, [expenseToRow(expense)]);
  return expense;
}

/** Sheet row number (1-based, header = 1) for a given expense id. */
async function findRowNumber(token: string, spreadsheetId: string, expenseId: string): Promise<number> {
  const ids = await sheetsApi.getValues(token, spreadsheetId, `${EXPENSES_TAB}!A2:A`);
  const index = ids.findIndex((row) => row[0] === expenseId);
  if (index === -1) throw new GoogleApiError(404, 'Expense not found in sheet');
  return index + 2;
}

export async function updateExpense(
  token: string,
  spreadsheetId: string,
  expenseId: string,
  input: NewExpense,
): Promise<Expense> {
  const rowNumber = await findRowNumber(token, spreadsheetId, expenseId);
  const existingRow = await sheetsApi.getValues(
    token,
    spreadsheetId,
    `${EXPENSES_TAB}!A${rowNumber}:${LAST_COLUMN}${rowNumber}`,
  );
  const existing = existingRow[0] ? rowToExpense(existingRow[0]) : null;
  const expense: Expense = {
    ...input,
    note: input.note ?? '',
    tags: input.tags ?? '',
    paymentMode: input.paymentMode ?? '',
    id: expenseId,
    createdAt: existing?.createdAt || new Date().toISOString(),
    month: input.date.slice(0, 7),
    source: existing?.source || 'web',
  };
  await sheetsApi.updateValues(
    token,
    spreadsheetId,
    `${EXPENSES_TAB}!A${rowNumber}:${LAST_COLUMN}${rowNumber}`,
    [expenseToRow(expense)],
  );
  return expense;
}

export async function deleteExpense(
  token: string,
  spreadsheetId: string,
  expenseId: string,
): Promise<void> {
  const rowNumber = await findRowNumber(token, spreadsheetId, expenseId);
  const meta = await sheetsApi.getMeta(token, spreadsheetId);
  const tab = meta.sheets.find((sheet) => sheet.properties.title === EXPENSES_TAB);
  if (!tab) throw new GoogleApiError(404, 'Expenses tab not found');
  await sheetsApi.batchUpdate(token, spreadsheetId, [
    {
      deleteDimension: {
        range: {
          sheetId: tab.properties.sheetId,
          dimension: 'ROWS',
          startIndex: rowNumber - 1, // 0-based, inclusive
          endIndex: rowNumber, // exclusive
        },
      },
    },
  ]);
}
