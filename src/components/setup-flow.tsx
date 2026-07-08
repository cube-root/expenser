'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'sonner';
import { FileSpreadsheet, Link2, Loader2, Sparkles } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { apiSend, fetcher } from '@/lib/client/fetcher';
import type { SheetInfo } from '@/lib/types';

type DiscoveredSheet = SheetInfo & { modifiedTime: string };

export function SetupFlow({ userName }: { userName: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState<'create' | 'connect' | string | null>(null);
  const [link, setLink] = useState('');
  const [discovered, setDiscovered] = useState<DiscoveredSheet[]>([]);

  useEffect(() => {
    fetcher<{ sheets: DiscoveredSheet[] }>('/api/sheets/discover')
      .then((data) => setDiscovered(data.sheets))
      .catch(() => setDiscovered([]));
  }, []);

  const finish = (info: SheetInfo) => {
    toast.success(`Connected to “${info.title}”`);
    router.replace('/dashboard');
  };

  const createSheet = async () => {
    setBusy('create');
    try {
      finish(await apiSend<SheetInfo>('/api/sheets/create', 'POST'));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not create the sheet');
      setBusy(null);
    }
  };

  const connectSheet = async (value: string, key: string) => {
    setBusy(key);
    try {
      finish(await apiSend<SheetInfo>('/api/sheets/connect', 'POST', { link: value }));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not connect the sheet');
      setBusy(null);
    }
  };

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
        {userName ? `Hi ${userName.split(' ')[0]}, ` : ''}let’s connect your expense sheet
      </h1>
      <p className="mt-2 text-sm text-muted-foreground text-center max-w-sm">
        Your Google Sheet is the database. Pick one of the options below — you can switch sheets
        any time in Settings.
      </p>

      <div className="mt-8 grid gap-4 w-full max-w-md">
        {discovered.length > 0 && (
          <Card className="border-green-600/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileSpreadsheet className="size-4 text-green-600" /> Reconnect your sheet
              </CardTitle>
              <CardDescription>We found sheets you used with MyExpense before.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              {discovered.slice(0, 3).map((sheet) => (
                <Button
                  key={sheet.spreadsheetId}
                  variant="outline"
                  className="justify-start"
                  disabled={busy !== null}
                  onClick={() => connectSheet(sheet.spreadsheetId, sheet.spreadsheetId)}
                >
                  {busy === sheet.spreadsheetId ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <FileSpreadsheet className="size-4" />
                  )}
                  <span className="truncate">{sheet.title}</span>
                </Button>
              ))}
            </CardContent>
          </Card>
        )}

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
              <Link2 className="size-4 text-green-600" /> Use an existing sheet
            </CardTitle>
            <CardDescription>
              Paste the link of any Google Sheet you own. We’ll add the structure it needs without
              touching your other tabs.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Input
              placeholder="https://docs.google.com/spreadsheets/d/…"
              value={link}
              onChange={(event) => setLink(event.target.value)}
              disabled={busy !== null}
            />
            <Button
              variant="secondary"
              disabled={busy !== null || link.trim().length === 0}
              onClick={() => connectSheet(link, 'connect')}
            >
              {busy === 'connect' ? <Loader2 className="size-4 animate-spin" /> : 'Connect'}
            </Button>
          </CardContent>
        </Card>
      </div>

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
