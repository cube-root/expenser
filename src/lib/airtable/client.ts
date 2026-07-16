/**
 * Thin fetch wrappers over the Airtable Web API. Acts as the signed-in user
 * via their OAuth token; access is limited to bases the user granted during
 * consent (Airtable's per-resource trust model, like Google's drive.file).
 */

const API_BASE = 'https://api.airtable.com/v0';

export class AirtableApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'AirtableApiError';
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
    let message = `Airtable API request failed (${response.status})`;
    try {
      const body = await response.json();
      message =
        (typeof body?.error === 'string' ? body.error : body?.error?.message) || message;
    } catch {
      // keep default message
    }
    throw new AirtableApiError(response.status, message);
  }
  return response.json() as Promise<T>;
}

export type AirtableRecord = {
  id: string;
  createdTime: string;
  fields: Record<string, unknown>;
};

type FieldSpec = { name: string; type: string; options?: Record<string, unknown> };

export const airtableApi = {
  listBases: (token: string) =>
    request<{ bases: { id: string; name: string; permissionLevel: string }[] }>(
      token,
      `${API_BASE}/meta/bases`,
    ),

  listTables: (token: string, baseId: string) =>
    request<{ tables: { id: string; name: string; fields: { name: string }[] }[] }>(
      token,
      `${API_BASE}/meta/bases/${baseId}/tables`,
    ),

  createField: (token: string, baseId: string, tableId: string, field: FieldSpec) =>
    request(token, `${API_BASE}/meta/bases/${baseId}/tables/${tableId}/fields`, {
      method: 'POST',
      body: JSON.stringify(field),
    }),

  createTable: (token: string, baseId: string, name: string, fields: FieldSpec[]) =>
    request(token, `${API_BASE}/meta/bases/${baseId}/tables`, {
      method: 'POST',
      body: JSON.stringify({ name, fields }),
    }),

  listRecords: async (token: string, baseId: string, table: string): Promise<AirtableRecord[]> => {
    const records: AirtableRecord[] = [];
    let offset: string | undefined;
    do {
      const query = offset ? `?pageSize=100&offset=${encodeURIComponent(offset)}` : '?pageSize=100';
      const page = await request<{ records: AirtableRecord[]; offset?: string }>(
        token,
        `${API_BASE}/${baseId}/${encodeURIComponent(table)}${query}`,
      );
      records.push(...page.records);
      offset = page.offset;
    } while (offset);
    return records;
  },

  createRecord: async (
    token: string,
    baseId: string,
    table: string,
    fields: Record<string, unknown>,
  ) => {
    const result = await request<{ records: AirtableRecord[] }>(
      token,
      `${API_BASE}/${baseId}/${encodeURIComponent(table)}`,
      { method: 'POST', body: JSON.stringify({ records: [{ fields }], typecast: true }) },
    );
    return result.records[0];
  },

  updateRecord: (
    token: string,
    baseId: string,
    table: string,
    recordId: string,
    fields: Record<string, unknown>,
  ) =>
    request<AirtableRecord>(
      token,
      `${API_BASE}/${baseId}/${encodeURIComponent(table)}/${recordId}`,
      { method: 'PATCH', body: JSON.stringify({ fields, typecast: true }) },
    ),

  deleteRecord: (token: string, baseId: string, table: string, recordId: string) =>
    request(token, `${API_BASE}/${baseId}/${encodeURIComponent(table)}/${recordId}`, {
      method: 'DELETE',
    }),
};
