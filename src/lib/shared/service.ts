import { randomUUID } from 'crypto';
import { sheetsApi, GoogleApiError } from '@/lib/sheets/client';
import { sheetUrl } from '@/lib/sheets/service';
import {
  sharedActivitySchema,
  sharedChargeSchema,
  sharedExpenseSchema,
  sharedPaymentSchema,
  sharedPersonSchema,
  type SharedActivity,
  type SharedCharge,
  type SharedExpense,
  type SharedLedgerDetail,
  type SharedLedgerSummary,
  type SharedPayment,
  type SharedPerson,
} from './types';

const CATALOG_TAB = 'SharedLedgers';
const TABS = {
  ledger: ['Ledger', ['Key', 'Value']],
  people: ['People', ['Id', 'Name', 'Email', 'ContributionType', 'RecurringAmount', 'Status']],
  activities: ['Activities', ['Id', 'Date', 'Name', 'Note', 'CreatedAt']],
  charges: ['ActivityCharges', ['ActivityId', 'PersonId', 'Amount']],
  payments: ['Payments', ['Id', 'PersonId', 'Date', 'Amount', 'Method', 'Note', 'CreatedAt', 'ReceivedBy']],
  expenses: ['SharedExpenses', ['Id', 'ActivityId', 'Date', 'Amount', 'Category', 'PaidBy', 'Note', 'CreatedAt']],
} as const;

type CatalogEntry = { id: string; title: string; url: string; addedAt: string };

async function ensureTabs(token: string, spreadsheetId: string) {
  const meta = await sheetsApi.getMeta(token, spreadsheetId);
  const existing = new Set(meta.sheets.map((sheet) => sheet.properties.title));
  const requests = Object.values(TABS)
    .filter(([name]) => !existing.has(name))
    .map(([name]) => ({ addSheet: { properties: { title: name, gridProperties: { frozenRowCount: 1 } } } }));
  if (requests.length) await sheetsApi.batchUpdate(token, spreadsheetId, requests);
  for (const [, [name, headers]] of Object.entries(TABS)) {
    const row = await sheetsApi.getValues(token, spreadsheetId, `${name}!A1:${column(headers.length)}1`);
    if (!row[0] || row[0].length < headers.length) {
      await sheetsApi.updateValues(token, spreadsheetId, `${name}!A1:${column(headers.length)}1`, [[...headers]]);
    }
  }
}

function column(count: number) {
  return String.fromCharCode(64 + count);
}

export async function ensureSharedCatalog(token: string, personalSheetId: string) {
  const meta = await sheetsApi.getMeta(token, personalSheetId);
  if (!meta.sheets.some((sheet) => sheet.properties.title === CATALOG_TAB)) {
    await sheetsApi.batchUpdate(token, personalSheetId, [
      { addSheet: { properties: { title: CATALOG_TAB, hidden: true } } },
    ]);
    await sheetsApi.updateValues(token, personalSheetId, `${CATALOG_TAB}!A1:D1`, [
      ['SpreadsheetId', 'Title', 'Url', 'AddedAt'],
    ]);
  }
}

export async function listCatalog(token: string, personalSheetId: string): Promise<CatalogEntry[]> {
  await ensureSharedCatalog(token, personalSheetId);
  const rows = await sheetsApi.getValues(token, personalSheetId, `${CATALOG_TAB}!A2:D`);
  return rows.filter((row) => row[0]).map((row) => ({
    id: row[0], title: row[1] || 'Shared ledger', url: row[2] || sheetUrl(row[0]), addedAt: row[3] || '',
  }));
}

export async function addCatalogEntry(token: string, personalSheetId: string, entry: CatalogEntry) {
  const entries = await listCatalog(token, personalSheetId);
  if (entries.some((item) => item.id === entry.id)) return;
  await sheetsApi.appendValues(token, personalSheetId, `${CATALOG_TAB}!A2:D`, [
    [entry.id, entry.title, entry.url, entry.addedAt],
  ]);
}

export async function removeCatalogEntry(token: string, personalSheetId: string, spreadsheetId: string) {
  await ensureSharedCatalog(token, personalSheetId);
  const rows = await sheetsApi.getValues(token, personalSheetId, `${CATALOG_TAB}!A2:A`);
  const index = rows.findIndex((row) => row[0] === spreadsheetId);
  if (index === -1) return;
  const rowNumber = index + 2;
  await sheetsApi.clearValues(token, personalSheetId, `${CATALOG_TAB}!A${rowNumber}:D${rowNumber}`);
}

export async function createSharedLedger(token: string, name: string, currency: string) {
  const created = await sheetsApi.createSpreadsheet(token, {
    properties: { title: `${name} · Shared Ledger` },
    sheets: Object.values(TABS).map(([title]) => ({ properties: { title, gridProperties: { frozenRowCount: 1 } } })),
  });
  await ensureTabs(token, created.spreadsheetId);
  await sheetsApi.updateValues(token, created.spreadsheetId, 'Ledger!A2:B4', [
    ['name', name], ['currency', currency], ['createdAt', new Date().toISOString()],
  ]);
  return { id: created.spreadsheetId, title: name, url: created.spreadsheetUrl || sheetUrl(created.spreadsheetId) };
}

export async function connectSharedLedger(token: string, spreadsheetId: string) {
  await ensureTabs(token, spreadsheetId);
  const meta = await sheetsApi.getMeta(token, spreadsheetId);
  const config = await sheetsApi.getValues(token, spreadsheetId, 'Ledger!A2:B10');
  const name = config.find((row) => row[0] === 'name')?.[1] || meta.properties.title;
  return { id: spreadsheetId, title: name, url: sheetUrl(spreadsheetId) };
}

function parseRows<T>(rows: string[][], parser: { safeParse(value: unknown): { success: boolean; data?: T } }, map: (row: string[]) => unknown): T[] {
  return rows.map((row) => parser.safeParse(map(row))).filter((result) => result.success).map((result) => result.data as T);
}

export async function getSharedLedger(token: string, spreadsheetId: string): Promise<SharedLedgerDetail> {
  await ensureTabs(token, spreadsheetId);
  const [meta, config, peopleRows, activityRows, chargeRows, paymentRows, expenseRows] = await Promise.all([
    sheetsApi.getMeta(token, spreadsheetId),
    sheetsApi.getValues(token, spreadsheetId, 'Ledger!A2:B10'),
    sheetsApi.getValues(token, spreadsheetId, 'People!A2:F'),
    sheetsApi.getValues(token, spreadsheetId, 'Activities!A2:E'),
    sheetsApi.getValues(token, spreadsheetId, 'ActivityCharges!A2:C'),
    sheetsApi.getValues(token, spreadsheetId, 'Payments!A2:H'),
    sheetsApi.getValues(token, spreadsheetId, 'SharedExpenses!A2:H'),
  ]);
  const people = parseRows<SharedPerson>(peopleRows, sharedPersonSchema, (r) => ({ id:r[0],name:r[1],email:r[2]||'',contributionType:r[3]||'per-activity',recurringAmount:r[4]||0,status:r[5]||'active' }));
  const activities = parseRows<SharedActivity>(activityRows, sharedActivitySchema, (r) => ({ id:r[0],date:r[1],name:r[2],note:r[3]||'',createdAt:r[4]||'' }));
  const charges = parseRows<SharedCharge>(chargeRows, sharedChargeSchema, (r) => ({ activityId:r[0],personId:r[1],amount:r[2]||0 }));
  const payments = parseRows<SharedPayment>(paymentRows, sharedPaymentSchema, (r) => ({ id:r[0],personId:r[1],date:r[2],amount:r[3],method:r[4]||'',note:r[5]||'',createdAt:r[6]||'',receivedBy:r[7]||'' }));
  const expenses = parseRows<SharedExpense>(expenseRows, sharedExpenseSchema, (r) => ({ id:r[0],activityId:r[1]||'',date:r[2],amount:r[3],category:r[4]||'Other',paidBy:r[5]||'',note:r[6]||'',createdAt:r[7]||'' }));
  const value = (key: string, fallback: string) => config.find((row) => row[0] === key)?.[1] || fallback;
  return {
    id: spreadsheetId, title: value('name', meta.properties.title), url: sheetUrl(spreadsheetId), currency: value('currency', '₹'),
    people, activities, charges, payments, expenses, peopleCount: people.filter((p) => p.status === 'active').length,
    totalCharges: charges.reduce((sum, row) => sum + row.amount, 0),
    totalPayments: payments.reduce((sum, row) => sum + row.amount, 0),
    totalExpenses: expenses.reduce((sum, row) => sum + row.amount, 0),
  };
}

export async function getSharedSummaries(token: string, personalSheetId: string): Promise<SharedLedgerSummary[]> {
  const entries = await listCatalog(token, personalSheetId);
  const results = await Promise.allSettled(entries.map((entry) => getSharedLedger(token, entry.id)));
  return results.filter((r): r is PromiseFulfilledResult<SharedLedgerDetail> => r.status === 'fulfilled').map((r) => r.value);
}

export async function addPerson(token: string, id: string, input: Omit<SharedPerson, 'id' | 'status'>) {
  const person = sharedPersonSchema.parse({ ...input, id: randomUUID(), status: 'active' });
  await sheetsApi.appendValues(token, id, 'People!A2:F', [[person.id, person.name, person.email, person.contributionType, person.recurringAmount, person.status]]);
  return person;
}

export async function addActivity(token: string, id: string, input: { date:string; name:string; note:string; totalAmount:number; payerId:string; participantIds:string[]; anonymousAmount?:number }) {
  const activity = sharedActivitySchema.parse({ id: randomUUID(), date: input.date, name: input.name, note: input.note, createdAt: new Date().toISOString() });
  await sheetsApi.appendValues(token, id, 'Activities!A2:E', [[activity.id, activity.date, activity.name, activity.note, activity.createdAt]]);
  const amountToSplit = input.totalAmount - (input.anonymousAmount ?? 0);
  const baseShare = Math.floor((amountToSplit / input.participantIds.length) * 100) / 100;
  const activityCharges: (string | number)[][] = input.participantIds.map((personId, index) => [
    activity.id,
    personId,
    index === input.participantIds.length - 1
      ? Math.round((amountToSplit - baseShare * (input.participantIds.length - 1)) * 100) / 100
      : baseShare,
  ]);
  if ((input.anonymousAmount ?? 0) > 0) {
    const anonymousId = `anonymous:${randomUUID()}`;
    activityCharges.push([activity.id, anonymousId, input.anonymousAmount as number]);
    const paymentId = randomUUID();
    await sheetsApi.appendValues(token, id, 'Payments!A2:H', [[
      paymentId, anonymousId, activity.date, input.anonymousAmount as number, '',
      `Anonymous collection · ${activity.name}`, new Date().toISOString(), '',
    ]]);
  }
  if (activityCharges.length) await sheetsApi.appendValues(token, id, 'ActivityCharges!A2:C', activityCharges);
  const expenseId = randomUUID();
  await sheetsApi.appendValues(token, id, 'SharedExpenses!A2:H', [[
    expenseId, activity.id, activity.date, input.totalAmount, 'Shared bill', input.payerId,
    input.note, new Date().toISOString(),
  ]]);
  return activity;
}

export async function addPayment(token: string, id: string, input: Omit<SharedPayment, 'id'|'createdAt'|'receivedBy'> & { receivedBy?: string }) {
  const row = sharedPaymentSchema.parse({ ...input, id: randomUUID(), createdAt: new Date().toISOString() });
  await sheetsApi.appendValues(token, id, 'Payments!A2:H', [[row.id,row.personId,row.date,row.amount,row.method,row.note,row.createdAt,row.receivedBy]]);
  return row;
}

export async function addSharedExpense(token: string, id: string, input: Omit<SharedExpense, 'id'|'createdAt'>) {
  const row = sharedExpenseSchema.parse({ ...input, id: randomUUID(), createdAt: new Date().toISOString() });
  await sheetsApi.appendValues(token, id, 'SharedExpenses!A2:H', [[row.id,row.activityId,row.date,row.amount,row.category,row.paidBy,row.note,row.createdAt]]);
  return row;
}

export function requireSheetId(input: string) {
  const match = input.trim().match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match) return match[1];
  if (/^[a-zA-Z0-9-_]{20,}$/.test(input.trim())) return input.trim();
  throw new GoogleApiError(400, 'Enter a valid Google Sheet URL');
}
