'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { ChartPie, List, LogOut, PlusCircle, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const TABS = [
  { href: '/dashboard', label: 'Dashboard', icon: ChartPie },
  { href: '/expenses', label: 'Expenses', icon: List },
  { href: '/add', label: 'Add', icon: PlusCircle },
  { href: '/settings', label: 'Settings', icon: Settings },
] as const;

export function AppNav({ user }: { user: { name: string; image: string } }) {
  const pathname = usePathname();

  return (
    <>
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="flex items-center justify-between max-w-3xl mx-auto px-4 h-14">
          <Link href="/dashboard" className="flex items-center">
            <Image
              src="/logo/straight.svg"
              alt="MyExpense"
              width={110}
              height={32}
              className="dark:hidden"
            />
            <Image
              src="/logo/straight-white.svg"
              alt="MyExpense"
              width={110}
              height={32}
              className="hidden dark:block"
            />
          </Link>

          {/* Desktop tabs */}
          <nav className="hidden sm:flex items-center gap-1">
            {TABS.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  'px-3 py-2 rounded-md text-sm flex items-center gap-1.5 transition-colors',
                  pathname.startsWith(tab.href)
                    ? 'bg-accent text-accent-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <tab.icon className="size-4" />
                {tab.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Popover>
              <PopoverTrigger
                aria-label="Account"
                className="rounded-full overflow-hidden size-8 border"
              >
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.image} alt={user.name} className="size-full object-cover" />
                ) : (
                  <span className="flex size-full items-center justify-center bg-accent text-xs">
                    {user.name.slice(0, 1) || '?'}
                  </span>
                )}
              </PopoverTrigger>
              <PopoverContent align="end" className="w-48 p-2">
                <p className="px-2 py-1.5 text-sm font-medium truncate">{user.name}</p>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-muted-foreground"
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  <LogOut className="size-4" /> Sign out of Google
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </header>

      {/* Mobile bottom tabs */}
      <nav className="sm:hidden fixed bottom-0 inset-x-0 z-40 border-t bg-background/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-4">
          {TABS.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'flex flex-col items-center gap-0.5 py-2 text-[11px]',
                pathname.startsWith(tab.href)
                  ? 'text-green-600 font-medium'
                  : 'text-muted-foreground',
              )}
            >
              <tab.icon className="size-5" />
              {tab.label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
