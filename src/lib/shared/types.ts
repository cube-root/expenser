import { z } from 'zod';

export const sharedPersonSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  email: z.string().default(''),
  contributionType: z.enum(['recurring', 'per-activity']).default('per-activity'),
  recurringAmount: z.coerce.number().min(0).default(0),
  status: z.enum(['active', 'inactive']).default('active'),
});

export const sharedActivitySchema = z.object({
  id: z.string().min(1),
  date: z.string(),
  name: z.string().min(1),
  note: z.string().default(''),
  createdAt: z.string(),
});

export const sharedChargeSchema = z.object({
  activityId: z.string().min(1),
  personId: z.string().min(1),
  amount: z.coerce.number().min(0),
});

export const sharedPaymentSchema = z.object({
  id: z.string().min(1),
  personId: z.string().min(1),
  date: z.string(),
  amount: z.coerce.number().positive(),
  method: z.string().default(''),
  note: z.string().default(''),
  createdAt: z.string(),
  receivedBy: z.string().default(''),
});

export const sharedExpenseSchema = z.object({
  id: z.string().min(1),
  activityId: z.string().default(''),
  date: z.string(),
  amount: z.coerce.number().positive(),
  category: z.string().default('Other'),
  paidBy: z.string().default(''),
  note: z.string().default(''),
  createdAt: z.string(),
});

export type SharedPerson = z.infer<typeof sharedPersonSchema>;
export type SharedActivity = z.infer<typeof sharedActivitySchema>;
export type SharedCharge = z.infer<typeof sharedChargeSchema>;
export type SharedPayment = z.infer<typeof sharedPaymentSchema>;
export type SharedExpense = z.infer<typeof sharedExpenseSchema>;

export type SharedLedgerSummary = {
  id: string;
  title: string;
  url: string;
  currency: string;
  peopleCount: number;
  totalCharges: number;
  totalPayments: number;
  totalExpenses: number;
};

export type SharedLedgerDetail = SharedLedgerSummary & {
  people: SharedPerson[];
  activities: SharedActivity[];
  charges: SharedCharge[];
  payments: SharedPayment[];
  expenses: SharedExpense[];
};
