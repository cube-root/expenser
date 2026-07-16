'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { PlusCircle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useExpenses, useSettings } from '@/lib/client/hooks';
import {
  byCategory,
  byDay,
  byMonth,
  inPeriod,
  PERIODS,
  totalIncome,
  totalSpend,
  type Period,
} from '@/lib/analytics';
import { currentMonth, formatAmount } from '@/lib/format';
import { CategoryDonut } from '@/components/charts/category-donut';
import { SpendOverTime } from '@/components/charts/spend-over-time';
import { BudgetCard } from '@/components/budget-card';
import { splitDebtLabel, summarizeSplitDebts } from '@/lib/split';

export default function DashboardPage() {
  const { expenses, isLoading: expensesLoading } = useExpenses();
  const { settings, isLoading: settingsLoading } = useSettings();
  const [period, setPeriod] = useState<Period>('this-month');

  const currency = settings?.defaultCurrency ?? '$';
  const isLoading = expensesLoading || settingsLoading;

  const inRange = useMemo(
    () => (expenses ?? []).filter((expense) => inPeriod(expense, period)),
    [expenses, period],
  );
  const spent = useMemo(() => totalSpend(inRange), [inRange]);
  const income = useMemo(() => totalIncome(inRange), [inRange]);
  const categories = useMemo(() => byCategory(inRange), [inRange]);
  const trend = useMemo(
    () =>
      period === 'this-year' || period === 'all' ? byMonth(inRange) : byDay(inRange, period),
    [inRange, period],
  );
  const splitBalances = useMemo(
    () =>
      summarizeSplitDebts(
        inRange
          .filter((expense) => expense.splitTotal > 0)
          .map((expense) => ({
            amount: expense.amount,
            splitWith: expense.splitWith,
            splitPaidBy: expense.splitPaidBy,
            currency: expense.currency || currency,
          })),
      ),
    [inRange, currency],
  );

  const thisMonth = currentMonth();
  const monthSpend = useMemo(
    () =>
      totalSpend((expenses ?? []).filter((expense) => expense.month === thisMonth)),
    [expenses, thisMonth],
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-9 w-40" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  const hasAny = (expenses?.length ?? 0) > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <Select value={period} onValueChange={(value) => setPeriod(value as Period)}>
          <SelectTrigger className="w-36" aria-label="Period">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PERIODS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!hasAny ? (
        <Card>
          <CardContent className="py-12 flex flex-col items-center text-center gap-4">
            <p className="text-muted-foreground">
              No expenses yet — add your first one and it lands straight in your Google Sheet.
            </p>
            <Button render={<Link href="/add" />}>
              <PlusCircle className="size-4" /> Add an expense
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-normal text-muted-foreground">
                  Spent · {PERIODS.find((option) => option.value === period)?.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold tabular-nums">
                  {formatAmount(spent, currency)}
                </p>
                {income > 0 && (
                  <p className="text-xs text-muted-foreground mt-1 tabular-nums">
                    +{formatAmount(income, currency)} income recorded
                  </p>
                )}
              </CardContent>
            </Card>
            <BudgetCard
              budget={settings?.monthlyBudget ?? 0}
              spent={monthSpend}
              month={thisMonth}
              currency={currency}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">By category</CardTitle>
            </CardHeader>
            <CardContent>
              <CategoryDonut
                data={categories}
                orderedCategories={settings?.categories ?? []}
                currency={currency}
              />
            </CardContent>
          </Card>

          {splitBalances.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="size-4 text-green-600" /> Split balances
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="divide-y">
                  {splitBalances.map((debt) => (
                    <li
                      key={`${debt.currency}-${debt.from}-${debt.to}`}
                      className="flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0"
                    >
                      <span className="text-sm">
                        {splitDebtLabel(debt)}
                      </span>
                      <span className="font-semibold tabular-nums text-amber-700 dark:text-amber-400">
                        {formatAmount(debt.amount, debt.currency)}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Spend over time</CardTitle>
            </CardHeader>
            <CardContent>
              <SpendOverTime data={trend} currency={currency} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
