import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import type { JWT } from 'next-auth/jwt';
import type { StoreProvider } from './lib/storage/types';

/**
 * Two backends, both with per-resource trust models:
 * - Google: drive.file only — the token can touch only files this app
 *   created or files the user picked in the Google Picker. Non-sensitive.
 * - Airtable: the token can access only the bases the user granted during
 *   the OAuth consent screen.
 * The chosen provider doubles as the storage backend for the session.
 */
const GOOGLE_SCOPES = [
  'openid',
  'email',
  'profile',
  'https://www.googleapis.com/auth/drive.file',
].join(' ');

const AIRTABLE_SCOPES = [
  'data.records:read',
  'data.records:write',
  'schema.bases:read',
  'schema.bases:write',
  'user.email:read',
].join(' ');

async function refreshGoogleToken(token: JWT): Promise<JWT> {
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
}

async function refreshAirtableToken(token: JWT): Promise<JWT> {
  const clientId = process.env.AUTH_AIRTABLE_ID ?? '';
  const clientSecret = process.env.AUTH_AIRTABLE_SECRET ?? '';
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: token.refreshToken as string,
  });
  const headers: Record<string, string> = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  if (clientSecret) {
    headers.Authorization = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`;
  } else {
    body.set('client_id', clientId);
  }
  const response = await fetch('https://airtable.com/oauth2/v1/token', {
    method: 'POST',
    headers,
    body,
  });
  const refreshed = await response.json();
  if (!response.ok) throw refreshed;
  return {
    ...token,
    accessToken: refreshed.access_token,
    expiresAt: Math.floor(Date.now() / 1000) + Number(refreshed.expires_in ?? 3600),
    // Airtable ROTATES refresh tokens on every use — the new one must be kept.
    refreshToken: refreshed.refresh_token ?? token.refreshToken,
    error: undefined,
  };
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    return token.provider === 'airtable'
      ? await refreshAirtableToken(token)
      : await refreshGoogleToken(token);
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
          scope: GOOGLE_SCOPES,
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    }),
    {
      id: 'airtable',
      name: 'Airtable',
      type: 'oauth',
      clientId: process.env.AUTH_AIRTABLE_ID,
      clientSecret: process.env.AUTH_AIRTABLE_SECRET,
      authorization: {
        url: 'https://airtable.com/oauth2/v1/authorize',
        params: { scope: AIRTABLE_SCOPES },
      },
      token: 'https://airtable.com/oauth2/v1/token',
      userinfo: 'https://api.airtable.com/v0/meta/whoami',
      checks: ['pkce', 'state'],
      profile(profile: { id: string; email?: string }) {
        return {
          id: profile.id,
          email: profile.email ?? null,
          name: profile.email ?? 'Airtable user',
        };
      },
    },
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, account }) {
      // Initial sign-in: persist the OAuth tokens in the (encrypted) JWT cookie.
      if (account) {
        return {
          ...token,
          provider: account.provider as StoreProvider,
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
      session.provider = (token.provider as StoreProvider | undefined) ?? 'google';
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
    /** OAuth access token used for the storage backend's API calls. */
    accessToken?: string;
    /** Which backend the user signed in with (google → Sheets, airtable → base). */
    provider?: StoreProvider;
    error?: 'RefreshTokenError';
  }
}
