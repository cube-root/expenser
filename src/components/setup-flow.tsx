'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'sonner';
import { Copy, Link as LinkIcon, Loader2, Share2, Sparkles } from 'lucide-react';
import { signIn, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiSend } from '@/lib/client/fetcher';
import type { StoreResource } from '@/lib/storage/types';

const GOOGLE_IDENTITY_SCOPES = 'openid email profile';
const GOOGLE_SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets';

export function SetupFlow({
  userName,
  serviceAccountEmail,
  hasSheetsAccess,
}: {
  userName: string;
  serviceAccountEmail?: string;
  hasSheetsAccess: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [sheetUrl, setSheetUrl] = useState('');
  const [sharedSheetUrl, setSharedSheetUrl] = useState('');
  const [setupMode, setSetupMode] = useState<'oauth' | 'service-account'>('oauth');

  const authorizeSheets = () => {
    setBusy('authorize');
    signIn(
      'google',
      { callbackUrl: '/setup' },
      {
        scope: `${GOOGLE_IDENTITY_SCOPES} ${GOOGLE_SHEETS_SCOPE}`,
        access_type: 'offline',
        prompt: 'consent',
        include_granted_scopes: 'true',
      },
    );
  };

  const finish = (info: StoreResource) => {
    toast.success(`Connected to “${info.title}”`);
    router.replace('/dashboard');
  };

  const createSheet = async () => {
    setBusy('create');
    try {
      finish(await apiSend<StoreResource>('/api/sheets/create', 'POST'));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not create the sheet');
      setBusy(null);
    }
  };

  const connectStore = async (
    value: string,
    key: string,
    accessMode: 'oauth' | 'service-account' = 'oauth',
  ) => {
    setBusy(key);
    try {
      finish(
        await apiSend<StoreResource>('/api/sheets/connect', 'POST', { link: value, accessMode }),
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not connect');
      setBusy(null);
    }
  };

  return (
    <main className="flex flex-1 flex-col items-center px-4 pb-10">
      <header className="flex h-16 w-full max-w-3xl items-center justify-between">
        <div>
          <Image
            src="/logo/straight.svg"
            alt="MyExpense"
            width={120}
            height={36}
            className="dark:hidden"
          />
          <Image
            src="/logo/straight-white.svg"
            alt="MyExpense"
            width={120}
            height={36}
            className="hidden dark:block"
          />
        </div>
        <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: '/' })}>
          Sign out of Google
        </Button>
      </header>
      <h1 className="mt-8 text-2xl font-semibold text-center">
        {userName ? `Hi ${userName.split(' ')[0]}, ` : ''}let’s connect your Google Sheet
      </h1>
      <p className="mt-2 text-sm text-muted-foreground text-center max-w-sm">
        Your Google Sheet is the database. Choose one of the options below — you can switch any time
        in Settings.
      </p>

      <div className="mt-8 grid gap-4 w-full max-w-md">
        {serviceAccountEmail && (
          <div className="grid grid-cols-2 rounded-lg bg-muted p-1" aria-label="Sheet access method">
            <Button
              type="button"
              variant={setupMode === 'oauth' ? 'default' : 'ghost'}
              className="h-9"
              aria-pressed={setupMode === 'oauth'}
              onClick={() => setSetupMode('oauth')}
            >
              Google account
            </Button>
            <Button
              type="button"
              variant={setupMode === 'service-account' ? 'default' : 'ghost'}
              className="h-9"
              aria-pressed={setupMode === 'service-account'}
              onClick={() => setSetupMode('service-account')}
            >
              Share one sheet
            </Button>
          </div>
        )}

        {(!serviceAccountEmail || setupMode === 'oauth') && !hasSheetsAccess && (
          <Card className="border-green-600/40">
            <CardHeader>
              <CardTitle className="text-base">Allow Google Sheets access</CardTitle>
              <CardDescription>
                This is requested only when you choose Google-account access. It lets MyExpense
                create, read, and update spreadsheets as you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={authorizeSheets} disabled={busy !== null}>
                {busy === 'authorize' && <Loader2 className="size-4 animate-spin" />}
                Continue to Google Sheets
              </Button>
            </CardContent>
          </Card>
        )}

        {(!serviceAccountEmail || setupMode === 'oauth') && hasSheetsAccess && <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="size-4 text-green-600" /> Create a new sheet
            </CardTitle>
            <CardDescription>
              We’ll create a ready-made “MyExpense Tracker” spreadsheet in your Google Drive.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={createSheet} disabled={busy !== null}>
              {busy === 'create' && <Loader2 className="size-4 animate-spin" />}
              Create my expense sheet
            </Button>
          </CardContent>
        </Card>}

        {serviceAccountEmail && setupMode === 'service-account' && (
          <Card className="border-green-600/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Share2 className="size-4 text-green-600" /> Share only one sheet
              </CardTitle>
              <CardDescription>
                Share your sheet with the service account as an Editor, then paste its URL. This
                method gives MyExpense access only to sheets explicitly shared with this address.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="overflow-hidden rounded-lg border bg-muted/30">
                <Image
                  src="/guides/share-google-sheet.gif"
                  alt="Animated steps showing how to share a Google Sheet with the service account"
                  width={720}
                  height={420}
                  unoptimized
                  className="h-auto w-full"
                />
              </div>
              <ol className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-green-600 text-xs font-semibold text-white">1</span>
                  <span>Open the Google Sheet you want to use and click <strong>Share</strong>.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-green-600 text-xs font-semibold text-white">2</span>
                  <span>Copy the service-account email below and paste it into the sharing dialog.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-green-600 text-xs font-semibold text-white">3</span>
                  <span>Choose <strong>Editor</strong>, click <strong>Send</strong>, then copy the Sheet URL from your browser.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-green-600 text-xs font-semibold text-white">4</span>
                  <span>Paste the URL below. We verify access before connecting or saving the sheet.</span>
                </li>
              </ol>
              <div className="space-y-1.5">
                <Label>Service-account email</Label>
                <div className="flex gap-2">
                  <Input readOnly value={serviceAccountEmail} className="font-mono text-xs" />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label="Copy service-account email"
                    onClick={async () => {
                      await navigator.clipboard.writeText(serviceAccountEmail);
                      toast.success('Service-account email copied');
                    }}
                  >
                    <Copy className="size-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="shared-sheet-url">Shared Google Sheet URL</Label>
                <Input
                  id="shared-sheet-url"
                  type="url"
                  inputMode="url"
                  placeholder="https://docs.google.com/spreadsheets/d/…"
                  value={sharedSheetUrl}
                  onChange={(event) => setSharedSheetUrl(event.target.value)}
                />
              </div>
              <Button
                className="w-full"
                onClick={() => connectStore(sharedSheetUrl, 'service-account', 'service-account')}
                disabled={busy !== null || !sharedSheetUrl.trim()}
              >
                {busy === 'service-account' ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Share2 className="size-4" />
                )}
                Connect shared sheet
              </Button>
            </CardContent>
          </Card>
        )}

        {(!serviceAccountEmail || setupMode === 'oauth') && hasSheetsAccess && <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <LinkIcon className="size-4 text-green-600" /> Use an existing sheet
            </CardTitle>
            <CardDescription>
              Paste the full URL of a Google Sheet you can edit. We’ll add the structure it needs
              without touching your other tabs.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="sheet-url">Google Sheet URL</Label>
              <Input
                id="sheet-url"
                type="url"
                inputMode="url"
                placeholder="https://docs.google.com/spreadsheets/d/…"
                value={sheetUrl}
                onChange={(event) => setSheetUrl(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && sheetUrl.trim() && busy === null) {
                    event.preventDefault();
                    connectStore(sheetUrl, 'connect');
                  }
                }}
              />
            </div>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => connectStore(sheetUrl, 'connect')}
              disabled={busy !== null || !sheetUrl.trim()}
            >
              {busy === 'connect' ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <LinkIcon className="size-4" />
              )}
              Connect sheet
            </Button>
          </CardContent>
        </Card>}
      </div>

      <p className="mt-6 text-xs text-muted-foreground text-center max-w-sm">
        {serviceAccountEmail && setupMode === 'service-account'
          ? 'Only sheets explicitly shared with the service-account email are accessible.'
          : hasSheetsAccess
            ? 'Google Sheets access is enabled. MyExpense does not request access to other Drive files.'
            : 'Google Sheets permission is requested only if you choose Google-account access.'}
      </p>
    </main>
  );
}
