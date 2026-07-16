import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import type { JWT } from 'next-auth/jwt';

export const GOOGLE_IDENTITY_SCOPES = ['openid', 'email', 'profile'].join(' ');
export const GOOGLE_SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets';

async function refreshGoogleToken(token: JWT): Promise<JWT> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.AUTH_GOOGLE_ID ?? '',
      client_secret: process.env.AUTH_GOOGLE_SECRET ?? '',
      grant_type: 'refresh_token',
      refresh_token: token.sheetsRefreshToken as string,
    }),
  });
  const refreshed = await response.json();
  if (!response.ok) throw refreshed;
  return {
    ...token,
    sheetsAccessToken: refreshed.access_token,
    sheetsExpiresAt: Math.floor(Date.now() / 1000) + Number(refreshed.expires_in ?? 3600),
    // Google only returns a new refresh token sometimes; keep the old one otherwise.
    sheetsRefreshToken: refreshed.refresh_token ?? token.sheetsRefreshToken,
    sheetsError: undefined,
  };
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    return await refreshGoogleToken(token);
  } catch {
    return { ...token, sheetsError: 'RefreshTokenError' as const };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Google({
      authorization: {
        params: {
          scope: GOOGLE_IDENTITY_SCOPES,
        },
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, account }) {
      // Only persist API tokens when this callback includes the incremental Sheets grant.
      if (account?.scope?.split(' ').includes(GOOGLE_SHEETS_SCOPE)) {
        return {
          ...token,
          sheetsAccessToken: account.access_token,
          sheetsRefreshToken: account.refresh_token ?? token.sheetsRefreshToken,
          sheetsExpiresAt: account.expires_at,
          sheetsError: undefined,
        };
      }
      if (account) return token;
      if (!token.sheetsAccessToken) return token;
      // Still valid (60s safety margin).
      if (token.sheetsExpiresAt && Date.now() / 1000 < (token.sheetsExpiresAt as number) - 60) {
        return token;
      }
      if (!token.sheetsRefreshToken) {
        return { ...token, sheetsError: 'RefreshTokenError' as const };
      }
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.sheetsAccessToken = token.sheetsAccessToken as string | undefined;
      session.hasSheetsAccess = Boolean(token.sheetsAccessToken);
      session.sheetsError = token.sheetsError as 'RefreshTokenError' | undefined;
      return session;
    },
  },
  pages: {
    signIn: '/',
  },
});

declare module 'next-auth' {
  interface Session {
    /** Incrementally granted OAuth token used only for Google Sheets API calls. */
    sheetsAccessToken?: string;
    hasSheetsAccess: boolean;
    sheetsError?: 'RefreshTokenError';
  }
}
