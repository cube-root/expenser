import { NextResponse } from 'next/server';
import { getAuthedContext, handleApiError, setSheetCookie } from '@/lib/api-helpers';
import { createExpenseSheet } from '@/lib/sheets/service';

export async function POST() {
  try {
    const { accessToken } = await getAuthedContext();
    const info = await createExpenseSheet(accessToken);
    const response = NextResponse.json(info);
    setSheetCookie(response, info.spreadsheetId);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
