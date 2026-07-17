import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getAuthedContext, handleApiError } from '@/lib/api-helpers';
import { addActivity, addPayment, addPerson, addSharedExpense, connectSharedLedger, getSharedLedger, listCatalog, removeCatalogEntry } from '@/lib/shared/service';

const actionSchema = z.discriminatedUnion('action', [
  z.object({ action:z.literal('person'), name:z.string().trim().min(1).max(80), email:z.string().trim().max(120).default(''), contributionType:z.enum(['recurring','per-activity']), recurringAmount:z.coerce.number().min(0) }),
  z.object({ action:z.literal('activity'), date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/), name:z.string().trim().min(1).max(100), note:z.string().trim().max(200).default(''), totalAmount:z.coerce.number().positive(), payerId:z.string().min(1), participantIds:z.array(z.string().min(1)).min(1), anonymousAmount:z.coerce.number().min(0).default(0) }).refine((value) => value.anonymousAmount <= value.totalAmount, { message: 'Drop-in collection cannot exceed the total bill' }),
  z.object({ action:z.literal('payment'), personId:z.string().min(1), date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/), amount:z.coerce.number().positive(), method:z.string().trim().max(50).default(''), note:z.string().trim().max(200).default('') }),
  z.object({ action:z.literal('anonymous-payment'), date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/), amount:z.coerce.number().positive(), note:z.string().trim().max(200).default(''), receivedBy:z.string().min(1) }),
  z.object({ action:z.literal('expense'), activityId:z.string().default(''), date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/), amount:z.coerce.number().positive(), category:z.string().trim().min(1).max(60), paidBy:z.string().trim().max(80).default(''), note:z.string().trim().max(200).default('') }),
]);

async function context(id: string) {
  const auth = await getAuthedContext({ requireSheet: true });
  const catalog = await listCatalog(auth.accessToken, auth.sheetId as string);
  if (!catalog.some((entry) => entry.id === id)) throw NextResponse.json({ error: 'Shared ledger is not connected' }, { status: 404 });
  return auth;
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { accessToken } = await context(id);
    return NextResponse.json(await getSharedLedger(accessToken, id));
  } catch (error) { return handleApiError(error); }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const parsed = actionSchema.safeParse(await request.json());
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      const field = issue?.path.length ? `${issue.path.join('.')}: ` : '';
      return NextResponse.json({ error: `${field}${issue?.message || 'Invalid entry'}` }, { status: 400 });
    }
    const { accessToken } = await context(id);
    const data = parsed.data;
    if (data.action === 'person') await addPerson(accessToken, id, data);
    if (data.action === 'activity') await addActivity(accessToken, id, data);
    if (data.action === 'payment') await addPayment(accessToken, id, data);
    if (data.action === 'anonymous-payment') await addPayment(accessToken, id, { personId:`anonymous:${crypto.randomUUID()}`, date:data.date, amount:data.amount, method:'', note:data.note||'Anonymous contribution', receivedBy:data.receivedBy });
    if (data.action === 'expense') await addSharedExpense(accessToken, id, data);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) { return handleApiError(error); }
}

export async function PUT(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { accessToken } = await context(id);
    await connectSharedLedger(accessToken, id);
    return NextResponse.json({ ok: true });
  } catch (error) { return handleApiError(error); }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { accessToken, sheetId } = await context(id);
    await removeCatalogEntry(accessToken, sheetId as string, id);
    return NextResponse.json({ ok: true });
  } catch (error) { return handleApiError(error); }
}
