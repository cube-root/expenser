import { NextResponse } from 'next/server';
import { getAuthedContext, handleApiError } from '@/lib/api-helpers';

/**
 * Stores the user has granted to this app (app-created/picked spreadsheets
 * for Google, granted bases for Airtable) — lets a returning user reconnect
 * without re-pasting anything.
 */
export async function GET() {
  try {
    const { accessToken, adapter } = await getAuthedContext();
    const sheets = await adapter.listAvailable(accessToken);
    return NextResponse.json({ sheets });
  } catch (error) {
    return handleApiError(error);
  }
}
