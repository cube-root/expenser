import { NextResponse } from 'next/server';
import { getAuthedContext, handleApiError } from '@/lib/api-helpers';
import { deleteExpense, updateExpense } from '@/lib/sheets/service';
import { newExpenseSchema } from '@/lib/types';

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const { accessToken, sheetId } = await getAuthedContext({ requireSheet: true });
    const body = newExpenseSchema.safeParse(await request.json());
    if (!body.success) {
      return NextResponse.json(
        { error: body.error.issues[0]?.message ?? 'Invalid expense' },
        { status: 400 },
      );
    }
    const expense = await updateExpense(accessToken, sheetId as string, id, body.data);
    return NextResponse.json({ expense });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const { accessToken, sheetId } = await getAuthedContext({ requireSheet: true });
    await deleteExpense(accessToken, sheetId as string, id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
