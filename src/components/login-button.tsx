'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
      <path
        fill="currentColor"
        d="M21.35 11.1H12v2.9h5.35c-.5 2.5-2.6 3.9-5.35 3.9a5.9 5.9 0 1 1 0-11.8c1.5 0 2.85.55 3.9 1.45l2.15-2.15A8.9 8.9 0 1 0 12 21c4.6 0 8.75-3.35 8.75-8.9 0-.35-.15-.7-.4-1Z"
      />
    </svg>
  );
}

function AirtableMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
      <path
        fill="currentColor"
        d="M11.15 2.6 2.5 6.18c-.48.2-.47.88.01 1.07l8.69 3.45c.51.2 1.08.2 1.6 0l8.69-3.45c.48-.19.49-.87.01-1.07L12.85 2.6a2.2 2.2 0 0 0-1.7 0ZM12.9 12.3v8.62c0 .41.41.69.79.54l9.68-3.76c.22-.09.37-.31.37-.55V8.53c0-.41-.41-.69-.79-.54l-9.68 3.76c-.22.09-.37.31-.37.55Zm-1.8 0c0-.24-.15-.46-.37-.55L1.05 7.99c-.38-.15-.79.13-.79.54v8.62c0 .24.15.46.37.55l9.68 3.76c.38.15.79-.13.79-.54V12.3Z"
      />
    </svg>
  );
}

export function LoginButton({
  provider = 'google',
  variant = 'default',
}: {
  provider?: 'google' | 'airtable';
  variant?: 'default' | 'outline';
}) {
  const [loading, setLoading] = useState(false);
  const label = provider === 'airtable' ? 'Continue with Airtable' : 'Continue with Google';
  return (
    <Button
      size="lg"
      variant={variant}
      className="rounded-full px-8 text-base w-64"
      disabled={loading}
      onClick={() => {
        setLoading(true);
        signIn(provider, { callbackUrl: '/' });
      }}
    >
      {loading ? (
        <Loader2 className="size-5 animate-spin" />
      ) : provider === 'airtable' ? (
        <AirtableMark />
      ) : (
        <GoogleMark />
      )}
      {label}
    </Button>
  );
}
