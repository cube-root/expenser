import { NextResponse } from 'next/server';
import { getAuthedContext, handleApiError } from '@/lib/api-helpers';
import { discoverSheets } from '@/lib/sheets/service';

/**
 * Spreadsheets this app created before (drive.file scope) — lets a returning
 * user on a new device reconnect without re-pasting the link.
 */
export async function GET() {
  try {
    const { accessToken } = await getAuthedContext();
    const sheets = await discoverSheets(accessToken);
    return NextResponse.json({ sheets });
  } catch (error) {
    return handleApiError(error);
  }
}
