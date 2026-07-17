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
    <main className="relative flex flex-1 flex-col overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(ellipse_at_top,rgba(34,197,94,0.12),transparent_65%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(34,197,94,0.08),transparent_65%)]"
        aria-hidden
      />

      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-4 sm:px-6 sm:py-5">
        <Link href="/" aria-label="MyExpense home">
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
        </Link>
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/cube-root/expenser"
            className="inline-flex h-9 items-center gap-2 rounded-full border px-3 text-xs font-medium transition-colors hover:bg-muted"
            target="_blank"
            rel="noreferrer"
          >
            <GitFork className="size-4" />
            <span className="hidden sm:inline">Open source</span>
          </a>
          <ThemeToggle />
        </div>
      </header>

      <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-5 pb-16 pt-12 sm:px-6 sm:pt-20">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="text-center lg:text-left">
            <p className="mb-5 text-sm font-medium text-green-700 dark:text-green-400">
              MyExpense <span aria-hidden>·</span> Google Sheets expense tracker
            </p>
            <h1 className="text-balance text-5xl font-semibold tracking-[-0.045em] sm:text-6xl lg:text-7xl">
              Your data belongs to <span className="text-green-600">you.</span>
            </h1>
            <div className="mt-8 flex flex-col items-center gap-3 lg:items-start">
              <LoginButton />
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="size-3.5 text-green-600" />
                No separate expense database. Revoke access anytime.
              </p>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div
              className="absolute -inset-4 -z-10 rounded-[2rem] bg-green-500/10 blur-2xl"
              aria-hidden
            />
            <div className="overflow-hidden rounded-3xl border bg-background shadow-xl shadow-green-950/5">
              <div className="flex items-center justify-between border-b px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-green-600 text-white shadow-sm">
                    <Sheet className="size-5" />
                  </span>
                  <div>
                    <h2 className="font-semibold">Your sheet, your records</h2>
                    <p className="text-xs text-muted-foreground">A database you can open</p>
                  </div>
                </div>
                <span className="rounded-full bg-green-600/10 px-2.5 py-1 text-[11px] font-medium text-green-700 dark:text-green-400">
                  You own it
                </span>
              </div>

              <div className="p-5">
                <p className="text-sm leading-6 text-muted-foreground">
                  MyExpense is a personal expense-tracking app for recording spending, organizing
                  categories, setting budgets, and viewing spending insights. It stores these
                  records directly in a Google Sheet you own and control.
                </p>

                <ul className="mt-5 divide-y overflow-hidden rounded-xl border bg-muted/20">
                  <li className="flex gap-3 p-3.5">
                    <Sheet className="mt-0.5 size-4 shrink-0 text-green-600" />
                    <p className="text-sm leading-5">
                      Your sheet is the database—open it anytime, anywhere.
                    </p>
                  </li>
                  <li className="flex gap-3 p-3.5">
                    <ShieldCheck className="mt-0.5 size-4 shrink-0 text-green-600" />
                    <p className="text-sm leading-5">
                      Uses Google Sheets only—no access to your other Drive file types or a separate
                      server database.
                    </p>
                  </li>
                  <li className="flex gap-3 p-3.5">
                    <Zap className="mt-0.5 size-4 shrink-0 text-green-600" />
                    <p className="text-sm leading-5">
                      One-tap entry with smart defaults, dashboards, and budgets built in.
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 border-t px-6 py-6 text-center text-xs text-muted-foreground">
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
