import { NextResponse } from 'next/server';
import { getAuthedContext, handleApiError } from '@/lib/api-helpers';
import { resyncSheet } from '@/lib/sheets/service';

/**
 * Re-apply the app's structure to the connected sheet: recreate missing
 * tabs, rewrite the Expenses header row to the current schema, and seed
 * config defaults if the Config tab is empty. Data rows are never touched.
 */
export async function POST() {
  try {
    const { accessToken, sheetId } = await getAuthedContext({ requireSheet: true });
    const info = await resyncSheet(accessToken, sheetId as string);
    return NextResponse.json(info);
  } catch (error) {
    return handleApiError(error);
  }
}
