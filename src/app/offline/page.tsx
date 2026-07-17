import Link from 'next/link';
import { WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Offline',
};

export default function OfflinePage() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-6">
      <div className="max-w-sm space-y-5 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
          <WifiOff className="size-6" aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">You’re offline</h1>
          <p className="text-muted-foreground">
            MyExpense needs a connection to sync with your Google Sheet. Reconnect and try again.
          </p>
        </div>
        <Button render={<Link href="/" />}>Try again</Button>
      </div>
    </main>
  );
}
