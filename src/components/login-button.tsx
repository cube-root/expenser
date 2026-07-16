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

export function LoginButton() {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      size="lg"
      className="rounded-full px-8 text-base w-64"
      disabled={loading}
      onClick={() => {
        setLoading(true);
        signIn('google', { callbackUrl: '/' });
      }}
    >
      {loading ? (
        <Loader2 className="size-5 animate-spin" />
      ) : (
        <GoogleMark />
      )}
      Continue with Google
    </Button>
  );
}
