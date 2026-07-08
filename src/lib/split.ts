/**
 * Split-with-friends encoding. The sheet stays human-readable:
 * `SplitWith` holds friends' shares as "Rahul: 300, Anna: 200" while the
 * row's `amount` is always YOUR share (so analytics need no special cases)
 * and `SplitTotal` is the full bill.
 */

export type SplitShare = { name: string; share: number };

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
