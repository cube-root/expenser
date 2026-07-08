'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ExternalLink, Pencil, PlusCircle, Search, Trash2, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ExpenseForm } from '@/components/expense-form';
import { apiSend } from '@/lib/client/fetcher';
import { useExpenses, useSettings, useSheetInfo } from '@/lib/client/hooks';
import { inPeriod, PERIODS, totalSpend, type Period } from '@/lib/analytics';
import { formatAmount, formatDate } from '@/lib/format';
import { parseSplitWith } from '@/lib/split';
import type { Expense, NewExpense } from '@/lib/types';

const ALL = '__all__';

export default function ExpensesPage() {
  const { expenses, isLoading, mutate } = useExpenses();
  const { settings } = useSettings();
  const { sheet } = useSheetInfo();

  const [period, setPeriod] = useState<Period>('this-month');
  const [category, setCategory] = useState<string>(ALL);
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<Expense | null>(null);
  const [deleting, setDeleting] = useState<Expense | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const filtered = useMemo(() => {
    const lowered = query.trim().toLowerCase();
    return (expenses ?? [])
      .filter((expense) => inPeriod(expense, period))
      .filter((expense) => category === ALL || expense.category === category)
      .filter(
        (expense) =>
          lowered === '' ||
          expense.note.toLowerCase().includes(lowered) ||
          expense.tags.toLowerCase().includes(lowered) ||
          expense.category.toLowerCase().includes(lowered),
      )
      .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  }, [expenses, period, category, query]);

  const total = useMemo(() => totalSpend(filtered), [filtered]);
  const currency = settings?.defaultCurrency ?? '$';

  const saveEdit = async (values: NewExpense) => {
    if (!editing) return;
    try {
      await apiSend(`/api/expenses/${editing.id}`, 'PUT', values);
      toast.success('Expense updated');
      setEditing(null);
      mutate();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update');
      throw error;
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await apiSend(`/api/expenses/${deleting.id}`, 'DELETE');
      toast.success('Expense deleted');
      setDeleting(null);
      mutate();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete');
    } finally {
      setDeleteBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">Expenses</h1>
        {sheet && (
          <a
            href={sheet.url}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-muted-foreground flex items-center gap-1 hover:text-foreground"
          >
            Open sheet <ExternalLink className="size-3" />
          </a>
        )}
      </div>

      {/* Filters — one row, wraps on small screens */}
      <div className="flex flex-wrap gap-2">
        <Select value={period} onValueChange={(value) => setPeriod(value as Period)}>
          <SelectTrigger className="w-34" aria-label="Period">
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
        <Select value={category} onValueChange={(value) => setCategory(value ?? ALL)}>
          <SelectTrigger className="w-36" aria-label="Category">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All categories</SelectItem>
            {(settings?.categories ?? []).map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="relative flex-1 min-w-40">
          <Search className="size-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="Search note, tags…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>

      <p className="text-sm text-muted-foreground tabular-nums">
        {filtered.length} {filtered.length === 1 ? 'entry' : 'entries'} · total spent{' '}
        <span className="font-medium text-foreground">{formatAmount(total, currency)}</span>
      </p>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-16" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 flex flex-col items-center gap-4 text-center">
            <p className="text-muted-foreground">Nothing here for these filters.</p>
            <Button variant="outline" render={<Link href="/add" />}>
              <PlusCircle className="size-4" /> Add an expense
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ul className="space-y-2">
          {filtered.map((expense) => (
            <li
              key={expense.id}
              className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate">{expense.category}</span>
                  {expense.type === 'income' && (
                    <Badge variant="secondary" className="text-green-700 dark:text-green-500">
                      income
                    </Badge>
                  )}
                  {expense.splitTotal > 0 && (
                    <Badge variant="secondary">
                      <Users className="size-3" /> split
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {formatDate(expense.date)}
                  {expense.paymentMode && ` · ${expense.paymentMode}`}
                  {expense.splitTotal > 0 &&
                    ` · split of ${formatAmount(
                      expense.splitTotal,
                      expense.currency || currency,
                    )} with ${parseSplitWith(expense.splitWith)
                      .map((entry) => entry.name)
                      .join(', ')}`}
                  {expense.note && ` · ${expense.note}`}
                  {expense.tags && ` · #${expense.tags}`}
                </p>
              </div>
              <span
                className={
                  expense.type === 'income'
                    ? 'tabular-nums font-semibold text-green-700 dark:text-green-500'
                    : 'tabular-nums font-semibold'
                }
              >
                {expense.type === 'income' ? '+' : ''}
                {formatAmount(expense.amount, expense.currency || currency)}
              </span>
              <div className="flex">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Edit"
                  onClick={() => setEditing(expense)}
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Delete"
                  className="text-muted-foreground hover:text-red-600"
                  onClick={() => setDeleting(expense)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Edit dialog */}
      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit expense</DialogTitle>
          </DialogHeader>
          {editing && settings && (
            <ExpenseForm
              settings={settings}
              initial={editing}
              submitLabel="Save changes"
              onSubmit={saveEdit}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={deleting !== null} onOpenChange={(open) => !open && setDeleting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this entry?</DialogTitle>
            <DialogDescription>
              {deleting &&
                `${deleting.category} · ${formatAmount(
                  deleting.amount,
                  deleting.currency || currency,
                )} on ${formatDate(deleting.date)}. This removes the row from your Google Sheet.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleting(null)} disabled={deleteBusy}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleteBusy}>
              {deleteBusy ? 'Deleting…' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
