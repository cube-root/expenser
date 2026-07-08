import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import type { JWT } from 'next-auth/jwt';

/**
 * Google OAuth with the Sheets scope: the app reads/writes the user's
 * spreadsheet *as the user*. drive.file additionally lets the app create
 * the expense sheet and re-discover it later (it only exposes files this
 * app created/opened — not the user's whole Drive).
 */
const SCOPES = [
  'openid',
  'email',
  'profile',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file',
].join(' ');

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.AUTH_GOOGLE_ID ?? '',
        client_secret: process.env.AUTH_GOOGLE_SECRET ?? '',
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken as string,
      }),
    });
    const refreshed = await response.json();
    if (!response.ok) throw refreshed;
    return {
      ...token,
      accessToken: refreshed.access_token,
      expiresAt: Math.floor(Date.now() / 1000) + Number(refreshed.expires_in ?? 3600),
      // Google only returns a new refresh token sometimes; keep the old one otherwise.
      refreshToken: refreshed.refresh_token ?? token.refreshToken,
      error: undefined,
    };
  } catch {
    return { ...token, error: 'RefreshTokenError' as const };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Google({
      authorization: {
        params: {
          scope: SCOPES,
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, account }) {
      // Initial sign-in: persist the OAuth tokens in the (encrypted) JWT cookie.
      if (account) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token ?? token.refreshToken,
          expiresAt: account.expires_at,
        };
      }
      // Still valid (60s safety margin).
      if (token.expiresAt && Date.now() / 1000 < (token.expiresAt as number) - 60) {
        return token;
      }
      if (!token.refreshToken) return { ...token, error: 'RefreshTokenError' as const };
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string | undefined;
      session.error = token.error as 'RefreshTokenError' | undefined;
      return session;
    },
  },
  pages: {
    signIn: '/',
  },
});

declare module 'next-auth' {
  interface Session {
    /** Google OAuth access token used for Sheets/Drive calls. */
    accessToken?: string;
    error?: 'RefreshTokenError';
  }
}
