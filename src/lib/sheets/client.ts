/**
 * Thin fetch wrappers over the Google Sheets REST API.
 * All calls act as the signed-in user via their OAuth access token —
 * there is no service account and no server-side database.
 */

const SHEETS_BASE = 'https://sheets.googleapis.com/v4/spreadsheets';

export class GoogleApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'GoogleApiError';
  }
}

async function request<T>(token: string, url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    cache: 'no-store',
  });
  if (!response.ok) {
    let message = `Google API request failed (${response.status})`;
    try {
      const body = await response.json();
      message = body?.error?.message || message;
    } catch {
      // keep default message
    }
    throw new GoogleApiError(response.status, message);
  }
  return response.json() as Promise<T>;
}

export type SheetProperties = { sheetId: number; title: string; hidden?: boolean };

export const sheetsApi = {
  /** Spreadsheet metadata: title + tab list. */
  getMeta: (token: string, spreadsheetId: string) =>
    request<{ properties: { title: string }; sheets: { properties: SheetProperties }[] }>(
      token,
      `${SHEETS_BASE}/${spreadsheetId}?fields=properties.title,sheets.properties(sheetId,title,hidden)`,
    ),

  createSpreadsheet: (token: string, body: unknown) =>
    request<{ spreadsheetId: string; spreadsheetUrl: string; properties: { title: string } }>(
      token,
      SHEETS_BASE,
      { method: 'POST', body: JSON.stringify(body) },
    ),

  getValues: async (token: string, spreadsheetId: string, range: string) => {
    const data = await request<{ values?: string[][] }>(
      token,
      `${SHEETS_BASE}/${spreadsheetId}/values/${encodeURIComponent(range)}`,
    );
    return data.values ?? [];
  },

  updateValues: (token: string, spreadsheetId: string, range: string, values: (string | number)[][]) =>
    request(
      token,
      `${SHEETS_BASE}/${spreadsheetId}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`,
      { method: 'PUT', body: JSON.stringify({ values }) },
    ),

  appendValues: (token: string, spreadsheetId: string, range: string, values: (string | number)[][]) =>
    request(
      token,
      `${SHEETS_BASE}/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
      { method: 'POST', body: JSON.stringify({ values }) },
    ),

  clearValues: (token: string, spreadsheetId: string, range: string) =>
    request(
      token,
      `${SHEETS_BASE}/${spreadsheetId}/values/${encodeURIComponent(range)}:clear`,
      { method: 'POST', body: JSON.stringify({}) },
    ),

  batchUpdate: (token: string, spreadsheetId: string, requests: unknown[]) =>
    request(token, `${SHEETS_BASE}/${spreadsheetId}:batchUpdate`, {
      method: 'POST',
      body: JSON.stringify({ requests }),
    }),
};
