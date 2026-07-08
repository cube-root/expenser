'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { ExpenseForm } from '@/components/expense-form';
import { apiSend } from '@/lib/client/fetcher';
import { getLastUsed, setLastUsed, useSettings } from '@/lib/client/hooks';
import type { Expense, NewExpense } from '@/lib/types';

export default function AddExpensePage() {
  const router = useRouter();
  const { settings, isLoading } = useSettings();

  if (isLoading || !settings) {
    return (
      <div className="max-w-md mx-auto space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-12" />
        <Skeleton className="h-24" />
        <Skeleton className="h-40" />
      </div>
    );
  }

  const lastUsed = getLastUsed();

  const submit = async (values: NewExpense) => {
    try {
      await apiSend<{ expense: Expense }>('/api/expenses', 'POST', values);
      setLastUsed({
        category: values.category,
        paymentMode: values.paymentMode,
        currency: values.currency,
      });
      toast.success('Added to your sheet', {
        action: {
          label: 'View',
          onClick: () => router.push('/expenses'),
        },
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add expense');
      throw error;
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-4">Add an expense</h1>
      <ExpenseForm
        settings={settings}
        initial={{
          category: lastUsed.category,
          paymentMode: lastUsed.paymentMode,
          currency: lastUsed.currency || settings.defaultCurrency,
        }}
        submitLabel="Add expense"
        onSubmit={submit}
      />
      <p className="text-center text-xs text-muted-foreground mt-3">
        Entries are stored in your own Google Sheet.
      </p>
    </div>
  );
}
