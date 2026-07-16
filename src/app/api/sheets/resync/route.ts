import { NextResponse } from 'next/server';
import { getAuthedContext, handleApiError } from '@/lib/api-helpers';

/**
 * Re-apply the app's structure to the connected store: recreate missing
 * tabs/tables, bring headers/fields up to the current schema, and seed
 * config defaults if missing. Data rows/records are never touched.
 */
export async function POST() {
  try {
    const { accessToken, adapter, sheetId } = await getAuthedContext({ requireSheet: true });
    const info = await adapter.connect(accessToken, sheetId as string, { forceStructure: true });
    return NextResponse.json(info);
  } catch (error) {
    return handleApiError(error);
  }
}
