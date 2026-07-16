/**
 * Split-with-friends encoding. The sheet stays human-readable:
 * `SplitWith` holds friends' shares as "Rahul: 300, Anna: 200" while the
 * row's `amount` is always YOUR share (so analytics need no special cases)
 * and `SplitTotal` is the full bill.
 */

export type SplitShare = { name: string; share: number };
export type SplitDebt = { from: string; to: string; amount: number };

export function splitDebtLabel(debt: Pick<SplitDebt, 'from' | 'to'>): string {
  return debt.from === 'You' ? `You owe ${debt.to}` : `${debt.from} owes ${debt.to}`;
}

export function parseSplitWith(value: string): SplitShare[] {
  if (!value.trim()) return [];
  return value
    .split(',')
    .map((part) => {
      const separator = part.lastIndexOf(':');
      if (separator === -1) return { name: part.trim(), share: 0 };
      const share = Number(part.slice(separator + 1).trim());
      return {
        name: part.slice(0, separator).trim(),
        share: Number.isNaN(share) ? 0 : share,
      };
    })
    .filter((entry) => entry.name.length > 0);
}

export function formatSplitWith(shares: SplitShare[]): string {
  // Commas/colons are the encoding's delimiters — strip them from names.
  return shares
    .map((entry) => `${entry.name.replace(/[,:]+/g, ' ').trim()}: ${entry.share}`)
    .join(', ');
}

export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function splitDebts(
  yourShare: number,
  splitWith: string,
  paidBy = 'You',
): SplitDebt[] {
  const shares = [{ name: 'You', share: yourShare }, ...parseSplitWith(splitWith)];
  return shares
    .filter((entry) => entry.name !== paidBy && entry.share > 0)
    .map((entry) => ({ from: entry.name, to: paidBy, amount: round2(entry.share) }));
}

export function summarizeSplitDebts(
  entries: { amount: number; splitWith: string; splitPaidBy: string; currency: string }[],
): (SplitDebt & { currency: string })[] {
  const totals = new Map<string, number>();
  for (const entry of entries) {
    for (const debt of splitDebts(entry.amount, entry.splitWith, entry.splitPaidBy)) {
      const forward = `${entry.currency}\u0000${debt.from}\u0000${debt.to}`;
      const reverse = `${entry.currency}\u0000${debt.to}\u0000${debt.from}`;
      const reverseAmount = totals.get(reverse) ?? 0;
      if (reverseAmount >= debt.amount) {
        totals.set(reverse, round2(reverseAmount - debt.amount));
      } else {
        totals.delete(reverse);
        totals.set(forward, round2((totals.get(forward) ?? 0) + debt.amount - reverseAmount));
      }
    }
  }
  return [...totals.entries()]
    .filter(([, amount]) => amount > 0)
    .map(([key, amount]) => {
      const [currency, from, to] = key.split('\u0000');
      return { currency, from, to, amount };
    })
    .sort((a, b) => b.amount - a.amount);
}
