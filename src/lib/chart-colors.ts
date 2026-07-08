/**
 * Categorical palette (validated, CVD-safe ordering — see the dataviz reference
 * palette). Hues are assigned to categories by *identity* in the order the user
 * defined them in Settings, never by rank in a given chart, so a category keeps
 * its color across filters and periods. Categories beyond 8 fold into "Other".
 */
export const CATEGORICAL_LIGHT = [
  '#2a78d6', // blue
  '#1baf7a', // aqua
  '#eda100', // yellow
  '#008300', // green
  '#4a3aa7', // violet
  '#e34948', // red
  '#e87ba4', // magenta
  '#eb6834', // orange
] as const;

export const CATEGORICAL_DARK = [
  '#3987e5',
  '#199e70',
  '#c98500',
  '#008300',
  '#9085e9',
  '#e66767',
  '#d55181',
  '#d95926',
] as const;

export const MAX_SLICES = 8;

export function paletteFor(mode: 'light' | 'dark'): readonly string[] {
  return mode === 'dark' ? CATEGORICAL_DARK : CATEGORICAL_LIGHT;
}

/** Stable category → color mapping based on the user's settings order. */
export function colorForCategory(
  category: string,
  orderedCategories: string[],
  mode: 'light' | 'dark',
): string {
  const palette = paletteFor(mode);
  const index = orderedCategories.indexOf(category);
  if (index === -1 || index >= MAX_SLICES) return palette[MAX_SLICES - 1];
  return palette[index % MAX_SLICES];
}
