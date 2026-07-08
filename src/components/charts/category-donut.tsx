'use client';

import { useMemo } from 'react';
import { useTheme } from 'next-themes';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { colorForCategory, MAX_SLICES } from '@/lib/chart-colors';
import { formatAmount } from '@/lib/format';

type Slice = { category: string; total: number };

/**
 * Category share donut. Colors follow category identity (settings order), a
 * legend with values sits beside the plot so identity is never color-alone,
 * and the period total anchors the center.
 */
export function CategoryDonut({
  data,
  orderedCategories,
  currency,
}: {
  data: Slice[];
  orderedCategories: string[];
  currency: string;
}) {
  const { resolvedTheme } = useTheme();
  const mode = resolvedTheme === 'dark' ? 'dark' : 'light';

  // Fold everything beyond the top slices into "Other" so hues are never cycled.
  const slices = useMemo(() => {
    if (data.length <= MAX_SLICES) return data;
    const top = data.slice(0, MAX_SLICES - 1);
    const rest = data.slice(MAX_SLICES - 1).reduce((sum, slice) => sum + slice.total, 0);
    return [...top, { category: 'Other', total: rest }];
  }, [data]);

  const total = slices.reduce((sum, slice) => sum + slice.total, 0);

  if (slices.length === 0) {
    return <p className="text-sm text-muted-foreground py-10 text-center">No spends in this period.</p>;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <div className="relative h-44 w-44 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={slices}
              dataKey="total"
              nameKey="category"
              innerRadius="68%"
              outerRadius="100%"
              paddingAngle={2}
              strokeWidth={0}
            >
              {slices.map((slice) => (
                <Cell
                  key={slice.category}
                  fill={colorForCategory(slice.category, orderedCategories, mode)}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => formatAmount(Number(value), currency)}
              contentStyle={{
                background: 'var(--popover)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                color: 'var(--popover-foreground)',
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xs text-muted-foreground">Total</span>
          <span className="text-lg font-semibold">{formatAmount(total, currency)}</span>
        </div>
      </div>

      <ul className="flex-1 w-full space-y-1.5 text-sm">
        {slices.map((slice) => (
          <li key={slice.category} className="flex items-center gap-2">
            <span
              aria-hidden
              className="size-2.5 rounded-full shrink-0"
              style={{ background: colorForCategory(slice.category, orderedCategories, mode) }}
            />
            <span className="truncate">{slice.category}</span>
            <span className="ml-auto tabular-nums text-muted-foreground">
              {formatAmount(slice.total, currency)}
            </span>
            <span className="w-10 text-right tabular-nums text-xs text-muted-foreground">
              {total > 0 ? Math.round((slice.total / total) * 100) : 0}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
