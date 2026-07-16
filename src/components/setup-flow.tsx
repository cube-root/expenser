'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'sonner';
import {
  Database,
  FileSpreadsheet,
  FolderOpen,
  Loader2,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { signIn, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { apiSend, fetcher } from '@/lib/client/fetcher';
import { usePicker } from '@/lib/client/use-picker';
import type { StoreProvider, StoreResource } from '@/lib/storage/types';

export function SetupFlow({
  userName,
  provider,
}: {
  userName: string;
  provider: StoreProvider;
}) {
  const router = useRouter();
  const { openPicker } = usePicker();
  const [busy, setBusy] = useState<string | null>(null);
  const [discovered, setDiscovered] = useState<StoreResource[]>([]);
  const [discovering, setDiscovering] = useState(true);

  const loadDiscovered = useCallback(
    () =>
      fetcher<{ sheets: StoreResource[] }>('/api/sheets/discover')
        .then((data) => setDiscovered(data.sheets))
        .catch(() => setDiscovered([]))
        .finally(() => setDiscovering(false)),
    [],
  );

  useEffect(() => {
    loadDiscovered();
  }, [loadDiscovered]);

  const refreshDiscovered = () => {
    setDiscovering(true);
    loadDiscovered();
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

  const connectStore = async (value: string, key: string) => {
    setBusy(key);
    try {
      finish(await apiSend<StoreResource>('/api/sheets/connect', 'POST', { link: value }));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not connect');
      setBusy(null);
    }
  };

  const pickSheet = async () => {
    setBusy('pick');
    try {
      const spreadsheetId = await openPicker();
      if (!spreadsheetId) {
        setBusy(null); // cancelled
        return;
      }
      await connectStore(spreadsheetId, 'pick');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not open the file picker');
      setBusy(null);
    }
  };

  const isAirtable = provider === 'airtable';
  const storeNoun = isAirtable ? 'Airtable base' : 'Google Sheet';

  return (
    <main className="flex flex-1 flex-col items-center px-4 py-10">
      <Image src="/logo/straight.svg" alt="MyExpense" width={120} height={36} className="dark:hidden" />
      <Image
        src="/logo/straight-white.svg"
        alt="MyExpense"
        width={120}
        height={36}
        className="hidden dark:block"
      />
      <h1 className="mt-8 text-2xl font-semibold text-center">
        {userName ? `Hi ${userName.split(' ')[0]}, ` : ''}let’s connect your {storeNoun}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground text-center max-w-sm">
        Your {storeNoun} is the database. Pick one of the options below — you can switch any time
        in Settings.
      </p>

      <div className="mt-8 grid gap-4 w-full max-w-md">
        {discovered.length > 0 && (
          <Card className="border-green-600/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                {isAirtable ? (
                  <Database className="size-4 text-green-600" />
                ) : (
                  <FileSpreadsheet className="size-4 text-green-600" />
                )}
                {isAirtable ? 'Your granted bases' : 'Reconnect your sheet'}
              </CardTitle>
              <CardDescription>
                {isAirtable
                  ? 'Bases you granted to MyExpense during login. We’ll add the Expenses and Config tables it needs.'
                  : 'We found sheets you used with MyExpense before.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              {discovered.slice(0, 5).map((store) => (
                <Button
                  key={store.id}
                  variant="outline"
                  className="justify-start"
                  disabled={busy !== null}
                  onClick={() => connectStore(store.id, store.id)}
                >
                  {busy === store.id ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : isAirtable ? (
                    <Database className="size-4" />
                  ) : (
                    <FileSpreadsheet className="size-4" />
                  )}
                  <span className="truncate">{store.title}</span>
                </Button>
              ))}
            </CardContent>
          </Card>
        )}

        {isAirtable ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="size-4 text-green-600" /> Need a base?
              </CardTitle>
              <CardDescription>
                Create an empty base at airtable.com, then grant it to MyExpense — Airtable asks
                which bases to share when you log in. The app can only ever see the bases you
                grant.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="secondary"
                className="flex-1"
                disabled={busy !== null}
                onClick={() => signIn('airtable', { callbackUrl: '/setup' })}
              >
                <Database className="size-4" /> Grant a base
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                disabled={busy !== null || discovering}
                onClick={refreshDiscovered}
              >
                {discovering ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <RefreshCw className="size-4" />
                )}
                Refresh list
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card>
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
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <FolderOpen className="size-4 text-green-600" /> Use an existing sheet
                </CardTitle>
                <CardDescription>
                  Pick a spreadsheet in Google’s own dialog. Google shares <em>only that file</em>{' '}
                  with the app — nothing else in your Drive is visible to it. We’ll add the
                  structure it needs without touching your other tabs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={pickSheet}
                  disabled={busy !== null}
                >
                  {busy === 'pick' ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <FolderOpen className="size-4" />
                  )}
                  Pick from Google Drive
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <p className="mt-6 text-xs text-muted-foreground text-center max-w-sm">
        MyExpense can only access {isAirtable ? 'bases you grant it' : 'sheets it creates or ones you pick here'} —
        it has no access to anything else in your account.
      </p>

      <Button
        variant="ghost"
        className="mt-8 text-muted-foreground"
        onClick={() => signOut({ callbackUrl: '/' })}
      >
        Sign out
      </Button>
    </main>
  );
}
