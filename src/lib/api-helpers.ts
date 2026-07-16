import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { auth } from '@/auth';
import { GoogleApiError } from './sheets/client';
import { getAdapter } from './storage';
import { getServiceAccountAccessToken } from './google/service-account';
import type { StorageAdapter } from './storage/types';

export const SHEET_COOKIE = 'expenser_sheet_id';
export const ACCESS_MODE_COOKIE = 'expenser_access_mode';
export type SheetAccessMode = 'oauth' | 'service-account';

type AuthedContext = {
  accessToken: string;
  adapter: StorageAdapter;
  sheetId: string | null;
};

/**
 * Resolve the signed-in user's access token and connected spreadsheet id.
 * Throws a ready-to-return NextResponse on failure.
 */
export async function getAuthedContext(options?: {
  requireSheet?: boolean;
  accessMode?: SheetAccessMode;
}): Promise<AuthedContext> {
  const session = await auth();
  if (!session?.user) {
    throw NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  const cookieStore = await cookies();
  const sheetId = cookieStore.get(SHEET_COOKIE)?.value ?? null;
  const accessMode: SheetAccessMode = options?.accessMode
    ? options.accessMode
    : cookieStore.get(ACCESS_MODE_COOKIE)?.value === 'service-account'
      ? 'service-account'
      : 'oauth';
  if (options?.requireSheet && !sheetId) {
    // 428: client should send the user to /setup to connect a store.
    throw NextResponse.json({ error: 'No store connected' }, { status: 428 });
  }
  if (accessMode === 'oauth' && (!session.sheetsAccessToken || session.sheetsError)) {
    throw NextResponse.json({ error: 'Google Sheets authorization required' }, { status: 403 });
  }
  const accessToken = accessMode === 'service-account'
    ? await getServiceAccountAccessToken()
    : session.sheetsAccessToken as string;
  return { accessToken, adapter: getAdapter(), sheetId };
}

export function setSheetCookie(
  response: NextResponse,
  sheetId: string,
  accessMode: SheetAccessMode = 'oauth',
) {
  response.cookies.set(SHEET_COOKIE, sheetId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
  });
  response.cookies.set(ACCESS_MODE_COOKIE, accessMode, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
  });
}

export function clearSheetCookie(response: NextResponse) {
  response.cookies.set(SHEET_COOKIE, '', { maxAge: 0, path: '/' });
  response.cookies.set(ACCESS_MODE_COOKIE, '', { maxAge: 0, path: '/' });
}

/** Uniform error mapping for route handlers. */
export function handleApiError(error: unknown): NextResponse {
  if (error instanceof NextResponse) return error;
  if (error instanceof GoogleApiError) {
    // Pass through auth/permission/not-found; anything else is an upstream failure.
    const status = [400, 401, 403, 404].includes(error.status) ? error.status : 502;
    return NextResponse.json({ error: error.message }, { status });
  }
  console.error(error);
  return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
}
