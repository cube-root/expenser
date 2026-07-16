import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getAuthedContext, handleApiError, setSheetCookie } from '@/lib/api-helpers';
import { isServiceAccountConfigured } from '@/lib/google/service-account';
import { extractSpreadsheetId } from '@/lib/sheets/service';
import { GoogleApiError } from '@/lib/sheets/client';

const bodySchema = z.object({
  link: z.string().min(1),
  accessMode: z.enum(['oauth', 'service-account']).default('oauth'),
});

export async function POST(request: Request) {
  try {
    const body = bodySchema.safeParse(await request.json());
    if (!body.success) {
      return NextResponse.json({ error: 'A Google Sheet URL is required' }, { status: 400 });
    }
    if (body.data.accessMode === 'service-account' && !isServiceAccountConfigured()) {
      return NextResponse.json({ error: 'Service-account access is not configured' }, { status: 400 });
    }
    const { accessToken, adapter } = await getAuthedContext({ accessMode: body.data.accessMode });
    if (body.data.accessMode === 'service-account') {
      const spreadsheetId = extractSpreadsheetId(body.data.link);
      if (!spreadsheetId) {
        throw new GoogleApiError(400, 'That does not look like a Google Sheet URL');
      }
      try {
        // Read-only preflight: do not initialize or remember the sheet until access is proven.
        await adapter.getInfo(accessToken, spreadsheetId);
      } catch (error) {
        if (error instanceof GoogleApiError && [401, 403, 404].includes(error.status)) {
          throw new GoogleApiError(
            403,
            'The service account cannot access this sheet. Share it with the displayed email as an Editor, then try again.',
          );
        }
        throw error;
      }
    }
    const info = await adapter.connect(accessToken, body.data.link);
    const response = NextResponse.json(info);
    setSheetCookie(response, info.id, body.data.accessMode);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
