import { NextResponse } from 'next/server';
import { clearSheetCookie, getAuthedContext, handleApiError } from '@/lib/api-helpers';

/** Info about the currently connected store (sheet or base). */
export async function GET() {
  try {
    const { accessToken, adapter, sheetId } = await getAuthedContext({ requireSheet: true });
    const info = await adapter.getInfo(accessToken, sheetId as string);
    return NextResponse.json(info);
  } catch (error) {
    return handleApiError(error);
  }
}

/** Disconnect the current store (does not touch the data itself). */
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
