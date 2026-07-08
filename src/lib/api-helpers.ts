import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { auth } from '@/auth';
import { GoogleApiError } from './sheets/client';

export const SHEET_COOKIE = 'expenser_sheet_id';

type AuthedContext = {
  accessToken: string;
  sheetId: string | null;
};

/**
 * Resolve the signed-in user's Google access token + connected sheet id
 * (from an httpOnly cookie). Throws a ready-to-return NextResponse on failure.
 */
export async function getAuthedContext(options?: { requireSheet?: boolean }): Promise<AuthedContext> {
  const session = await auth();
  if (!session?.accessToken || session.error === 'RefreshTokenError') {
    throw NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  const cookieStore = await cookies();
  const sheetId = cookieStore.get(SHEET_COOKIE)?.value ?? null;
  if (options?.requireSheet && !sheetId) {
    // 428: client should send the user to /setup to connect a sheet.
    throw NextResponse.json({ error: 'No sheet connected' }, { status: 428 });
  }
  return { accessToken: session.accessToken, sheetId };
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
  if (error instanceof GoogleApiError) {
    // Token rejected by Google → treat as auth failure so the client re-logins.
    const status = error.status === 401 ? 401 : error.status === 403 ? 403 : error.status === 404 ? 404 : 502;
    return NextResponse.json({ error: error.message }, { status });
  }
  console.error(error);
  return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
}
