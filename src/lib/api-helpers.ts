import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { auth } from '@/auth';
import { GoogleApiError } from './sheets/client';
import { AirtableApiError } from './airtable/client';
import { getAdapter } from './storage';
import type { StorageAdapter, StoreProvider } from './storage/types';

export const SHEET_COOKIE = 'expenser_sheet_id'; // holds a spreadsheet OR base id

type AuthedContext = {
  accessToken: string;
  provider: StoreProvider;
  adapter: StorageAdapter;
  sheetId: string | null;
};

/**
 * Resolve the signed-in user's access token, storage backend (from the OAuth
 * provider they used) and connected store id (from an httpOnly cookie).
 * Throws a ready-to-return NextResponse on failure.
 */
export async function getAuthedContext(options?: { requireSheet?: boolean }): Promise<AuthedContext> {
  const session = await auth();
  if (!session?.accessToken || session.error === 'RefreshTokenError') {
    throw NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  const provider: StoreProvider = session.provider ?? 'google';
  const cookieStore = await cookies();
  const sheetId = cookieStore.get(SHEET_COOKIE)?.value ?? null;
  if (options?.requireSheet && !sheetId) {
    // 428: client should send the user to /setup to connect a store.
    throw NextResponse.json({ error: 'No store connected' }, { status: 428 });
  }
  return { accessToken: session.accessToken, provider, adapter: getAdapter(provider), sheetId };
}

export function setSheetCookie(response: NextResponse, sheetId: string) {
  response.cookies.set(SHEET_COOKIE, sheetId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
  });
}

export function clearSheetCookie(response: NextResponse) {
  response.cookies.set(SHEET_COOKIE, '', { maxAge: 0, path: '/' });
}

/** Uniform error mapping for route handlers. */
export function handleApiError(error: unknown): NextResponse {
  if (error instanceof NextResponse) return error;
  if (error instanceof GoogleApiError || error instanceof AirtableApiError) {
    // Pass through auth/permission/not-found; anything else is an upstream failure.
    const status = [400, 401, 403, 404].includes(error.status) ? error.status : 502;
    return NextResponse.json({ error: error.message }, { status });
  }
  console.error(error);
  return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
}
