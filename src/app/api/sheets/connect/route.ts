import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getAuthedContext, handleApiError, setSheetCookie } from '@/lib/api-helpers';

const bodySchema = z.object({ link: z.string().min(1) });

export async function POST(request: Request) {
  try {
    const { accessToken, adapter } = await getAuthedContext();
    const body = bodySchema.safeParse(await request.json());
    if (!body.success) {
      return NextResponse.json({ error: 'A sheet or base id is required' }, { status: 400 });
    }
    const info = await adapter.connect(accessToken, body.data.link);
    const response = NextResponse.json(info);
    setSheetCookie(response, info.id);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
