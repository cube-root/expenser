import { airtableApi, AirtableApiError, type AirtableRecord } from './client';
import { rowsToSettings, settingsToRows } from '../storage/settings-codec';
import { expenseSchema, type Expense, type NewExpense, type Settings } from '../types';
import type { StorageAdapter, StoreResource } from '../storage/types';

const EXPENSES_TABLE = 'Expenses';
const CONFIG_TABLE = 'Config';

/** Field specs for table creation — first entry is the primary field. */
const EXPENSE_FIELDS = [
  { name: 'Category', type: 'singleLineText' },
  { name: 'Date', type: 'date', options: { dateFormat: { name: 'iso' } } },
  { name: 'Amount', type: 'number', options: { precision: 2 } },
  { name: 'Currency', type: 'singleLineText' },
  { name: 'Type', type: 'singleLineText' },
  { name: 'PaymentMode', type: 'singleLineText' },
  { name: 'Note', type: 'multilineText' },
  { name: 'Tags', type: 'singleLineText' },
  { name: 'Month', type: 'singleLineText' },
  { name: 'Source', type: 'singleLineText' },
  { name: 'SplitTotal', type: 'number', options: { precision: 2 } },
  { name: 'SplitWith', type: 'singleLineText' },
];

const CONFIG_FIELDS = [
  { name: 'Key', type: 'singleLineText' },
  { name: 'Value', type: 'singleLineText' },
];

export function extractBaseId(input: string): string | null {
  const match = input.trim().match(/app[a-zA-Z0-9]{10,20}/);
  return match ? match[0] : null;
}

function baseUrl(baseId: string): string {
  return `https://airtable.com/${baseId}`;
}

function text(value: unknown): string {
  return typeof value === 'string' ? value : value == null ? '' : String(value);
}

function recordToExpense(record: AirtableRecord): Expense | null {
  const fields = record.fields;
  const date = text(fields.Date);
  const parsed = expenseSchema.safeParse({
    id: record.id,
    createdAt: record.createdTime,
    date,
    month: text(fields.Month) || date.slice(0, 7),
    amount: fields.Amount ?? 0,
    currency: text(fields.Currency) || '$',
    category: text(fields.Category) || 'Other',
    type: fields.Type === 'income' ? 'income' : 'expense',
    paymentMode: text(fields.PaymentMode),
    note: text(fields.Note),
    tags: text(fields.Tags),
    source: text(fields.Source) || 'web',
    splitTotal: fields.SplitTotal ?? 0,
    splitWith: text(fields.SplitWith),
  });
  return parsed.success ? parsed.data : null;
}

function expenseToFields(input: NewExpense): Record<string, unknown> {
  return {
    Category: input.category,
    Date: input.date,
    Amount: input.amount,
    Currency: input.currency,
    Type: input.type,
    PaymentMode: input.paymentMode ?? '',
    Note: input.note ?? '',
    Tags: input.tags ?? '',
    Month: input.date.slice(0, 7),
    SplitTotal: input.splitTotal > 0 ? input.splitTotal : null,
    SplitWith: input.splitWith ?? '',
  };
}

async function getBaseResource(token: string, baseId: string): Promise<StoreResource> {
  const { bases } = await airtableApi.listBases(token);
  const base = bases.find((candidate) => candidate.id === baseId);
  if (!base) {
    throw new AirtableApiError(404, 'Base not found — grant it to MyExpense during login');
  }
  return { id: base.id, title: base.name, url: baseUrl(base.id) };
}

/** Airtable backend — one granted base, Expenses + Config tables inside it. */
export const airtableAdapter: StorageAdapter = {
  storeNoun: 'Airtable base',

  listAvailable: async (token) => {
    const { bases } = await airtableApi.listBases(token);
    return bases
      .filter((base) => ['edit', 'create'].includes(base.permissionLevel))
      .map((base) => ({ id: base.id, title: base.name, url: baseUrl(base.id) }));
  },

  connect: async (token, input, options) => {
    const baseId = extractBaseId(input);
    if (!baseId) {
      throw new AirtableApiError(400, 'That does not look like an Airtable base');
    }
    // Verifies access and reveals which tables/fields exist.
    const { tables } = await airtableApi.listTables(token, baseId);

    const expensesTable = tables.find((table) => table.name === EXPENSES_TABLE);
    if (!expensesTable) {
      await airtableApi.createTable(token, baseId, EXPENSES_TABLE, EXPENSE_FIELDS);
    } else if (options?.forceStructure) {
      // Structure resync: add any fields the app's schema gained since.
      const existing = new Set(expensesTable.fields.map((field) => field.name));
      for (const field of EXPENSE_FIELDS) {
        if (!existing.has(field.name)) {
          await airtableApi.createField(token, baseId, expensesTable.id, field);
        }
      }
    }

    const configTable = tables.find((table) => table.name === CONFIG_TABLE);
    if (!configTable) {
      await airtableApi.createTable(token, baseId, CONFIG_TABLE, CONFIG_FIELDS);
      const records = settingsToRows(rowsToSettings([]));
      for (const [key, value] of records) {
        await airtableApi.createRecord(token, baseId, CONFIG_TABLE, { Key: key, Value: value });
      }
    }

    return getBaseResource(token, baseId);
  },

  // create() intentionally absent: the Airtable API needs a workspace id to
  // create bases; v1 asks the user to create an empty base and grant it.

  getInfo: getBaseResource,

  listExpenses: async (token, baseId) => {
    const records = await airtableApi.listRecords(token, baseId, EXPENSES_TABLE);
    return records
      .map(recordToExpense)
      .filter((expense): expense is Expense => expense !== null);
  },

  appendExpense: async (token, baseId, input, source = 'web') => {
    const record = await airtableApi.createRecord(token, baseId, EXPENSES_TABLE, {
      ...expenseToFields(input),
      Source: source,
    });
    const expense = recordToExpense(record);
    if (!expense) throw new AirtableApiError(502, 'Airtable returned an unexpected record');
    return expense;
  },

  updateExpense: async (token, baseId, expenseId, input) => {
    // Source is deliberately not patched — it records where the entry was born.
    const record = await airtableApi.updateRecord(
      token,
      baseId,
      EXPENSES_TABLE,
      expenseId,
      expenseToFields(input),
    );
    const expense = recordToExpense(record);
    if (!expense) throw new AirtableApiError(502, 'Airtable returned an unexpected record');
    return expense;
  },

  deleteExpense: async (token, baseId, expenseId) => {
    await airtableApi.deleteRecord(token, baseId, EXPENSES_TABLE, expenseId);
  },

  readSettings: async (token, baseId) => {
    const records = await airtableApi.listRecords(token, baseId, CONFIG_TABLE);
    return rowsToSettings(records.map((record) => [text(record.fields.Key), text(record.fields.Value)]));
  },

  writeSettings: async (token, baseId, settings: Settings) => {
    const records = await airtableApi.listRecords(token, baseId, CONFIG_TABLE);
    const byKey = new Map(records.map((record) => [text(record.fields.Key), record.id]));
    for (const [key, value] of settingsToRows(settings)) {
      const existingId = byKey.get(key);
      if (existingId) {
        await airtableApi.updateRecord(token, baseId, CONFIG_TABLE, existingId, { Value: value });
      } else {
        await airtableApi.createRecord(token, baseId, CONFIG_TABLE, { Key: key, Value: value });
      }
    }
  },
};
