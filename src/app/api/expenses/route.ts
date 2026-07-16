import { NextResponse } from 'next/server';
import { getAuthedContext, handleApiError } from '@/lib/api-helpers';
import { newExpenseSchema } from '@/lib/types';

export async function GET() {
  try {
    const { accessToken, adapter, sheetId } = await getAuthedContext({ requireSheet: true });
    const expenses = await adapter.listExpenses(accessToken, sheetId as string);
    return NextResponse.json({ expenses });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const { accessToken, adapter, sheetId } = await getAuthedContext({ requireSheet: true });
    const body = newExpenseSchema.safeParse(await request.json());
    if (!body.success) {
      return NextResponse.json(
        { error: body.error.issues[0]?.message ?? 'Invalid expense' },
        { status: 400 },
      );
    }
    const expense = await adapter.appendExpense(accessToken, sheetId as string, body.data, 'web');
    return NextResponse.json({ expense }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
