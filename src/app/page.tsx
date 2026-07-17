import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { GitFork, Sheet, ShieldCheck, Zap } from 'lucide-react';
import { auth } from '@/auth';
import { SHEET_COOKIE } from '@/lib/api-helpers';
import { LoginButton } from '@/components/login-button';
import { ThemeToggle } from '@/components/theme-toggle';

export default async function LandingPage() {
  const session = await auth();
  if (session?.user) {
    const hasSheet = (await cookies()).get(SHEET_COOKIE)?.value;
    redirect(hasSheet ? '/dashboard' : '/setup');
  }

  return (
    <main className="flex flex-1 flex-col">
      <header className="flex items-center justify-between px-6 py-4 max-w-4xl w-full mx-auto">
        <Image
          src="/logo/straight.svg"
          alt="MyExpense"
          width={130}
          height={40}
          className="dark:hidden"
          priority
        />
        <Image
          src="/logo/straight-white.svg"
          alt="MyExpense"
          width={130}
          height={40}
          className="hidden dark:block"
          priority
        />
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/cube-root/expenser"
            className="inline-flex h-9 items-center gap-2 rounded-full border px-3 text-xs font-medium transition-colors hover:bg-muted"
            target="_blank"
            rel="noreferrer"
          >
            <GitFork className="size-4" /> Open source
          </a>
          <ThemeToggle />
        </div>
      </header>

      <section className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight max-w-xl">
          Your data belongs to <span className="text-green-600">you</span>
        </h1>
        <p className="mt-4 text-muted-foreground max-w-md text-balance">
          Track every spend in seconds — stored straight into your own Google Sheet. No database,
          no lock-in.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <LoginButton />
        </div>

        <ul className="mt-14 grid gap-6 sm:grid-cols-3 max-w-2xl text-sm text-muted-foreground">
          <li className="flex flex-col items-center gap-2">
            <Sheet className="size-6 text-green-600" />
            Your sheet is the database — open it anytime, anywhere
          </li>
          <li className="flex flex-col items-center gap-2">
            <ShieldCheck className="size-6 text-green-600" />
            Uses Google Sheets only — no access to your other Drive file types or server database
          </li>
          <li className="flex flex-col items-center gap-2">
            <Zap className="size-6 text-green-600" />
            One-tap entry with smart defaults, dashboard and budgets built in
          </li>
        </ul>
      </section>

      <footer className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 px-6 py-6 text-center text-xs text-muted-foreground">
        <Link href="/privacy" className="underline underline-offset-4">
          Privacy Policy
        </Link>
        <span aria-hidden>·</span>
        <Link href="/terms" className="underline underline-offset-4">
          Terms of Service
        </Link>
        <span aria-hidden>·</span>
        <a
          href="https://github.com/cube-root/expenser"
          className="underline underline-offset-4"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
      </footer>
    </main>
  );
}
