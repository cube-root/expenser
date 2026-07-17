import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-full">
      <header className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-4">
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
        <ThemeToggle />
      </header>

      <article className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {updated}</p>
        <div className="mt-10 space-y-8 text-sm leading-7 text-foreground/85 [&_a]:text-green-700 [&_a]:underline [&_a]:underline-offset-4 dark:[&_a]:text-green-400 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-foreground [&_li]:ml-5 [&_li]:list-disc [&_p+p]:mt-3 [&_ul]:mt-3 [&_ul]:space-y-2">
          {children}
        </div>
      </article>

      <footer className="mx-auto flex max-w-3xl gap-4 px-6 py-8 text-xs text-muted-foreground">
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
        <Link href="/">Home</Link>
      </footer>
    </main>
  );
}
