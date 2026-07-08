'use client';

import Link from 'next/link';
import { AlertTriangle, CheckCircle2, CircleAlert } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatAmount, monthLabel } from '@/lib/format';
import { cn } from '@/lib/utils';

/**
 * Monthly budget progress. Status is never color-alone: each state ships an
 * icon + text label alongside the colored meter.
 */
export function BudgetCard({
  budget,
  spent,
  month,
  currency,
}: {
  budget: number;
  spent: number;
  month: string;
  currency: string;
}) {
  if (budget <= 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Monthly budget</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          No budget set.{' '}
          <Link href="/settings" className="underline underline-offset-4">
            Set one in Settings
          </Link>{' '}
          to track your progress here.
        </CardContent>
      </Card>
    );
  }

  const ratio = spent / budget;
  const percent = Math.min(ratio * 100, 100);
  const state =
    ratio > 1 ? 'over' : ratio >= 0.8 ? 'close' : 'ok';

  const meta = {
    ok: {
      icon: CheckCircle2,
      label: 'On track',
      text: 'text-green-700 dark:text-green-500',
      bar: 'bg-green-600',
    },
    close: {
      icon: CircleAlert,
      label: 'Getting close',
      text: 'text-amber-700 dark:text-amber-500',
      bar: 'bg-amber-500',
    },
    over: {
      icon: AlertTriangle,
      label: 'Over budget',
      text: 'text-red-700 dark:text-red-500',
      bar: 'bg-red-600',
    },
  }[state];

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">Budget · {monthLabel(month)}</CardTitle>
        <span className={cn('flex items-center gap-1 text-sm font-medium', meta.text)}>
          <meta.icon className="size-4" /> {meta.label}
        </span>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between text-sm mb-2">
          <span className="text-2xl font-semibold tabular-nums">
            {formatAmount(spent, currency)}
          </span>
          <span className="text-muted-foreground tabular-nums">
            of {formatAmount(budget, currency)}
          </span>
        </div>
        <div
          className="h-2.5 rounded-full bg-muted overflow-hidden"
          role="progressbar"
          aria-valuenow={Math.round(ratio * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Budget used"
        >
          <div className={cn('h-full rounded-full', meta.bar)} style={{ width: `${percent}%` }} />
        </div>
        <p className="mt-2 text-xs text-muted-foreground tabular-nums">
          {ratio > 1
            ? `${formatAmount(spent - budget, currency)} over — ${Math.round(ratio * 100)}% used`
            : `${formatAmount(budget - spent, currency)} left — ${Math.round(ratio * 100)}% used`}
        </p>
      </CardContent>
    </Card>
  );
}
