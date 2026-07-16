import {
  appendExpense,
  connectSheet,
  createExpenseSheet,
  deleteExpense,
  extractSpreadsheetId,
  getSheetInfo,
  listExpenses,
  readSettings,
  updateExpense,
  writeSettings,
} from '../sheets/service';
import { GoogleApiError } from '../sheets/client';
import type { SheetInfo } from '../types';
import type { StorageAdapter, StoreResource } from './types';

function toResource(info: SheetInfo): StoreResource {
  return { id: info.spreadsheetId, title: info.title, url: info.url };
}

/** Google Sheets backend — thin wrapper over the existing sheet service. */
export const sheetsAdapter: StorageAdapter = {
  storeNoun: 'Google Sheet',

  connect: async (token, input, options) => {
    const spreadsheetId = extractSpreadsheetId(input);
    if (!spreadsheetId) {
      throw new GoogleApiError(400, 'That does not look like a Google Sheet');
    }
    return toResource(
      await connectSheet(token, spreadsheetId, { forceHeaders: options?.forceStructure }),
    );
  },

  create: async (token) => toResource(await createExpenseSheet(token)),

  getInfo: async (token, resourceId) => toResource(await getSheetInfo(token, resourceId)),
  listExpenses,
  appendExpense,
  updateExpense,
  deleteExpense,
  readSettings,
  writeSettings,
};
