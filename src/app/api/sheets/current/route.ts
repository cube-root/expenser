import { NextResponse } from 'next/server';
import { clearSheetCookie, getAuthedContext, handleApiError } from '@/lib/api-helpers';
import { getSheetInfo } from '@/lib/sheets/service';

/** Info about the currently connected sheet. */
export async function GET() {
  try {
    const { accessToken, sheetId } = await getAuthedContext({ requireSheet: true });
    const info = await getSheetInfo(accessToken, sheetId as string);
    return NextResponse.json(info);
  } catch (error) {
    return handleApiError(error);
  }
}

/** Disconnect the current sheet (does not touch the spreadsheet itself). */
export async function DELETE() {
  try {
    await getAuthedContext();
    const response = NextResponse.json({ ok: true });
    clearSheetCookie(response);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
