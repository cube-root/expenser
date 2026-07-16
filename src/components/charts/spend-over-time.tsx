'use client';

import { useTheme } from 'next-themes';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatAmount } from '@/lib/format';

type Point = { date: string; label: string; total: number };

/** Single-series spend trend — one axis, recessive grid, crosshair tooltip. */
export function SpendOverTime({ data, currency }: { data: Point[]; currency: string }) {
  const { resolvedTheme } = useTheme();
  const line = resolvedTheme === 'dark' ? '#3987e5' : '#2a78d6';

  if (data.length === 0) {
    return <p className="text-sm text-muted-foreground py-10 text-center">No spends in this period.</p>;
  }

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="spendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={line} stopOpacity={0.25} />
              <stop offset="100%" stopColor={line} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="var(--border)" strokeOpacity={0.6} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            tickLine={false}
            axisLine={false}
            minTickGap={28}
          />
          <YAxis
            width={44}
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: number) =>
              Intl.NumberFormat(undefined, { notation: 'compact' }).format(value)
            }
          />
          <Tooltip
            formatter={(value) => [formatAmount(Number(value), currency), 'Spent']}
            labelStyle={{ color: 'var(--muted-foreground)' }}
            contentStyle={{
              background: 'var(--popover)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              color: 'var(--popover-foreground)',
              fontSize: 12,
            }}
            cursor={{ stroke: 'var(--muted-foreground)', strokeDasharray: '3 3' }}
          />
          <Area
            type="monotone"
            dataKey="total"
            stroke={line}
            strokeWidth={2}
            fill="url(#spendFill)"
            activeDot={{ r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
