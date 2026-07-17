import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getAuthedContext, handleApiError } from '@/lib/api-helpers';
import {
  addCatalogEntry,
  connectSharedLedger,
  createSharedLedger,
  getSharedSummaries,
  requireSheetId,
} from '@/lib/shared/service';

const createSchema = z.discriminatedUnion('mode', [
  z.object({ mode: z.literal('create'), name: z.string().trim().min(1).max(80), currency: z.string().min(1).max(8) }),
  z.object({ mode: z.literal('connect'), link: z.string().trim().min(1) }),
]);

export async function GET() {
  try {
    const { accessToken, sheetId } = await getAuthedContext({ requireSheet: true });
    return NextResponse.json({ ledgers: await getSharedSummaries(accessToken, sheetId as string) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const parsed = createSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: 'Check the shared ledger details' }, { status: 400 });
    const { accessToken, sheetId } = await getAuthedContext({ requireSheet: true });
    const resource = parsed.data.mode === 'create'
      ? await createSharedLedger(accessToken, parsed.data.name, parsed.data.currency)
      : await connectSharedLedger(accessToken, requireSheetId(parsed.data.link));
    await addCatalogEntry(accessToken, sheetId as string, { ...resource, addedAt: new Date().toISOString() });
    return NextResponse.json(resource, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
