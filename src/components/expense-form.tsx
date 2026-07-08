'use client';

import { useState } from 'react';
import { Divide, Loader2, Plus, Users, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { formatAmount, todayISO } from '@/lib/format';
import { formatSplitWith, parseSplitWith, round2 } from '@/lib/split';
import { CURRENCIES, type NewExpense, type Settings } from '@/lib/types';

function ChipGroup({
  options,
  value,
  onChange,
  label,
  allowEmpty,
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  label: string;
  allowEmpty?: boolean;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((option) => {
        const selected = value === option;
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={selected}
            className={cn(
              'px-3 py-1.5 rounded-full border text-sm transition-colors',
              selected
                ? 'bg-green-600 border-green-600 text-white'
                : 'bg-background hover:bg-accent',
            )}
            onClick={() => onChange(selected && allowEmpty ? '' : option)}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

type FriendRow = { name: string; share: string };

export type ExpenseFormValues = NewExpense;

export function ExpenseForm({
  settings,
  initial,
  submitLabel,
  onSubmit,
}: {
  settings: Settings;
  initial?: Partial<ExpenseFormValues>;
  submitLabel: string;
  onSubmit: (values: ExpenseFormValues) => Promise<void>;
}) {
  const initialSplit = Boolean(initial?.splitTotal && initial.splitTotal > 0);
  // When split, the big amount field holds the TOTAL bill; your share is derived.
  const [amount, setAmount] = useState(() => {
    if (initialSplit) return String(initial?.splitTotal ?? '');
    return initial?.amount ? String(initial.amount) : '';
  });
  const [split, setSplit] = useState(initialSplit);
  const [friends, setFriends] = useState<FriendRow[]>(() => {
    const parsed = parseSplitWith(initial?.splitWith ?? '');
    return parsed.length > 0
      ? parsed.map((entry) => ({ name: entry.name, share: String(entry.share) }))
      : [{ name: '', share: '' }];
  });
  const [currency, setCurrency] = useState(initial?.currency || settings.defaultCurrency);
  const [category, setCategory] = useState(initial?.category ?? '');
  const [paymentMode, setPaymentMode] = useState(initial?.paymentMode ?? '');
  const [date, setDate] = useState(initial?.date || todayISO());
  const [note, setNote] = useState(initial?.note ?? '');
  const [tags, setTags] = useState(initial?.tags ?? '');
  const [type, setType] = useState<'expense' | 'income'>(initial?.type ?? 'expense');
  const [submitting, setSubmitting] = useState(false);

  const currencyOptions = CURRENCIES.includes(currency)
    ? CURRENCIES
    : [currency, ...CURRENCIES];

  const splitActive = split && type === 'expense';
  const totalNumber = Number(amount) || 0;
  const friendsSum = friends.reduce((sum, friend) => sum + (Number(friend.share) || 0), 0);
  const yourShare = round2(totalNumber - friendsSum);

  const splitEqually = () => {
    if (totalNumber <= 0) {
      toast.error('Enter the total bill first');
      return;
    }
    const count = friends.length + 1; // friends + you
    const each = round2(totalNumber / count);
    setFriends(friends.map((friend) => ({ ...friend, share: String(each) })));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const parsedAmount = Number(amount);
    if (!amount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error(splitActive ? 'Enter the total bill amount' : 'Enter an amount greater than 0');
      return;
    }
    if (!category) {
      toast.error('Pick a category');
      return;
    }

    let finalAmount = parsedAmount;
    let splitTotal = 0;
    let splitWith = '';
    if (splitActive) {
      const filled = friends.filter((friend) => friend.name.trim() || friend.share.trim());
      if (filled.length === 0) {
        toast.error('Add at least one friend to split with');
        return;
      }
      if (filled.some((friend) => !friend.name.trim() || (Number(friend.share) || 0) <= 0)) {
        toast.error('Every friend needs a name and a share greater than 0');
        return;
      }
      if (yourShare <= 0) {
        toast.error('Friends’ shares exceed the total — your share must be above 0');
        return;
      }
      finalAmount = yourShare;
      splitTotal = parsedAmount;
      splitWith = formatSplitWith(
        filled.map((friend) => ({ name: friend.name.trim(), share: Number(friend.share) })),
      );
    }

    setSubmitting(true);
    try {
      await onSubmit({
        amount: finalAmount,
        currency,
        category,
        paymentMode,
        date,
        note: note.trim(),
        tags: tags.trim(),
        type,
        splitTotal,
        splitWith,
      });
      // Reset only the per-entry fields; keep the sticky choices.
      setAmount('');
      setNote('');
      setTags('');
      setSplit(false);
      setFriends([{ name: '', share: '' }]);
    } catch {
      // onSubmit already surfaced the error (toast); keep the form filled.
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Tabs value={type} onValueChange={(value) => setType(value as 'expense' | 'income')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="expense">Expense</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-1.5">
        <Label htmlFor="amount">{splitActive ? 'Total bill' : 'Amount'}</Label>
        <div className="flex gap-2">
          <Select value={currency} onValueChange={(value) => setCurrency(value ?? currency)}>
            <SelectTrigger className="w-20" aria-label="Currency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencyOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            id="amount"
            type="number"
            inputMode="decimal"
            step="any"
            min="0"
            placeholder="0.00"
            autoFocus
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="text-2xl h-12 font-semibold"
          />
        </div>
      </div>

      {type === 'expense' && (
        <div className="space-y-2">
          <button
            type="button"
            aria-pressed={split}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm transition-colors',
              split
                ? 'bg-green-600 border-green-600 text-white'
                : 'bg-background hover:bg-accent',
            )}
            onClick={() => setSplit(!split)}
          >
            <Users className="size-4" /> Split with friends
          </button>

          {splitActive && (
            <div className="rounded-lg border p-3 space-y-2">
              {friends.map((friend, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Name"
                    aria-label={`Friend ${index + 1} name`}
                    value={friend.name}
                    onChange={(event) =>
                      setFriends(
                        friends.map((row, i) =>
                          i === index ? { ...row, name: event.target.value } : row,
                        ),
                      )
                    }
                  />
                  <Input
                    type="number"
                    inputMode="decimal"
                    step="any"
                    min="0"
                    placeholder="Share"
                    aria-label={`Friend ${index + 1} share`}
                    className="w-28"
                    value={friend.share}
                    onChange={(event) =>
                      setFriends(
                        friends.map((row, i) =>
                          i === index ? { ...row, share: event.target.value } : row,
                        ),
                      )
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Remove person"
                    disabled={friends.length === 1}
                    onClick={() => setFriends(friends.filter((_, i) => i !== index))}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              ))}

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFriends([...friends, { name: '', share: '' }])}
                >
                  <Plus className="size-4" /> Add person
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={splitEqually}>
                  <Divide className="size-4" /> Split equally
                </Button>
              </div>

              <p
                className={cn(
                  'text-sm tabular-nums',
                  yourShare <= 0 && totalNumber > 0 ? 'text-red-600' : 'text-muted-foreground',
                )}
              >
                Your share: <span className="font-medium">{formatAmount(Math.max(yourShare, 0), currency)}</span>
                {totalNumber > 0 && ` of ${formatAmount(totalNumber, currency)}`}
                {yourShare <= 0 && totalNumber > 0 && ' — shares exceed the total'}
              </p>
              <p className="text-xs text-muted-foreground">
                Only your share counts in your spending; the full bill and shares are saved to the
                sheet.
              </p>
            </div>
          )}
        </div>
      )}

      <div className="space-y-1.5">
        <Label>Category</Label>
        <ChipGroup
          options={settings.categories}
          value={category}
          onChange={setCategory}
          label="Category"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={date}
            max={todayISO()}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="tags">Tags (optional)</Label>
          <Input
            id="tags"
            placeholder="trip, family"
            value={tags}
            onChange={(event) => setTags(event.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Payment mode</Label>
        <ChipGroup
          options={settings.paymentModes}
          value={paymentMode}
          onChange={setPaymentMode}
          label="Payment mode"
          allowEmpty
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="note">Note (optional)</Label>
        <Input
          id="note"
          placeholder="What was it for?"
          maxLength={200}
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />
      </div>

      <Button type="submit" size="lg" className="w-full rounded-full" disabled={submitting}>
        {submitting && <Loader2 className="size-4 animate-spin" />}
        {submitLabel}
      </Button>
    </form>
  );
}
