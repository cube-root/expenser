import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getAuthedContext, handleApiError, setSheetCookie } from '@/lib/api-helpers';
import { connectSheet, extractSpreadsheetId } from '@/lib/sheets/service';

const bodySchema = z.object({ link: z.string().min(1) });

export async function POST(request: Request) {
  try {
    const { accessToken } = await getAuthedContext();
    const body = bodySchema.safeParse(await request.json());
    if (!body.success) {
      return NextResponse.json({ error: 'Sheet link is required' }, { status: 400 });
    }
    const spreadsheetId = extractSpreadsheetId(body.data.link);
    if (!spreadsheetId) {
      return NextResponse.json(
        { error: 'That does not look like a Google Sheets link' },
        { status: 400 },
      );
    }
    const info = await connectSheet(accessToken, spreadsheetId);
    const response = NextResponse.json(info);
    setSheetCookie(response, info.spreadsheetId);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
