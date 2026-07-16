import { NextResponse } from 'next/server';
import { getAuthedContext, handleApiError, setSheetCookie } from '@/lib/api-helpers';

export async function POST() {
  try {
    const { accessToken, adapter } = await getAuthedContext();
    if (!adapter.create) {
      return NextResponse.json(
        {
          error: `Creating a new ${adapter.storeNoun} from the app isn't supported — create one there and grant it during login, then pick it here.`,
        },
        { status: 400 },
      );
    }
    const info = await adapter.create(accessToken);
    const response = NextResponse.json(info);
    setSheetCookie(response, info.id);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
