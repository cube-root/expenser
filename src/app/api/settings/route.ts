import { NextResponse } from 'next/server';
import { getAuthedContext, handleApiError } from '@/lib/api-helpers';
import { settingsSchema } from '@/lib/types';

export async function GET() {
  try {
    const { accessToken, adapter, sheetId } = await getAuthedContext({ requireSheet: true });
    const settings = await adapter.readSettings(accessToken, sheetId as string);
    return NextResponse.json({ settings });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request) {
  try {
    const { accessToken, adapter, sheetId } = await getAuthedContext({ requireSheet: true });
    const body = settingsSchema.safeParse(await request.json());
    if (!body.success) {
      return NextResponse.json(
        { error: body.error.issues[0]?.message ?? 'Invalid settings' },
        { status: 400 },
      );
    }
    await adapter.writeSettings(accessToken, sheetId as string, body.data);
    return NextResponse.json({ settings: body.data });
  } catch (error) {
    return handleApiError(error);
  }
}
