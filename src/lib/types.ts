import { z } from 'zod';

/**
 * A single expense row. The Google Sheet is the source of truth;
 * these fields map 1:1 to columns A..L of the "Expenses" tab.
 */
export const expenseSchema = z.object({
  id: z.string().min(1),
  createdAt: z.string(), // ISO timestamp of entry
  date: z.string(), // YYYY-MM-DD (spend date)
  month: z.string(), // YYYY-MM, derived from date (for pivots/analytics)
  amount: z.coerce.number(),
  currency: z.string().min(1),
  category: z.string().min(1),
  type: z.enum(['expense', 'income']).default('expense'),
  paymentMode: z.string().default(''),
  note: z.string().default(''),
  tags: z.string().default(''), // comma separated
  source: z.string().default('web'),
  // Split with friends: amount above is always YOUR share; these record the rest.
  splitTotal: z.coerce.number().default(0), // full bill; 0 = not split
  splitWith: z.string().default(''), // "Rahul: 300, Anna: 200"
  splitPaidBy: z.string().default('You'),
});

export type Expense = z.infer<typeof expenseSchema>;

/** Payload accepted by POST /api/expenses — server derives id/createdAt/month/source. */
export const newExpenseSchema = z.object({
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date'),
  currency: z.string().min(1),
  category: z.string().min(1, 'Please choose a category'),
  type: z.enum(['expense', 'income']).default('expense'),
  paymentMode: z.string().default(''),
  note: z.string().max(200).default(''),
  tags: z.string().max(200).default(''),
  splitTotal: z.coerce.number().min(0).default(0),
  splitWith: z.string().max(500).default(''),
  splitPaidBy: z.string().max(100).default('You'),
}).refine(
  (value) => value.splitTotal === 0 || value.splitTotal >= value.amount,
  { message: 'Split total must be at least your share' },
);

export type NewExpense = z.infer<typeof newExpenseSchema>;

/** User settings, stored as key/value pairs in the hidden "Config" tab of the sheet. */
export const settingsSchema = z.object({
  categories: z.array(z.string().min(1)).min(1),
  paymentModes: z.array(z.string().min(1)).min(1),
  defaultCurrency: z.string().min(1),
  monthlyBudget: z.coerce.number().min(0),
});

export type Settings = z.infer<typeof settingsSchema>;

export const DEFAULT_SETTINGS: Settings = {
  categories: [
    'Food',
    'Groceries',
    'Transport',
    'Shopping',
    'Bills',
    'Entertainment',
    'Health',
    'Other',
  ],
  paymentModes: ['UPI', 'Card', 'Cash', 'Bank transfer', 'Other'],
  defaultCurrency: '$',
  monthlyBudget: 0,
};

export type SheetInfo = {
  spreadsheetId: string;
  title: string;
  url: string;
};

export const CURRENCIES = ['$', '₹', '€', '£', '¥', 'A$', 'C$', 'Fr', 'kr', 'R'];
