import type { Expense, NewExpense, Settings } from '../types';

/** A connectable Google spreadsheet. */
export type StoreResource = {
  id: string;
  title: string;
  url: string;
  modifiedTime?: string;
};

/**
 * Backend-agnostic storage contract. Every method takes the user's OAuth
 * access token — adapters are stateless, in keeping with the no-database
 * architecture (the store itself holds all data and settings).
 */
export interface StorageAdapter {
  /** Human name for UI copy. */
  storeNoun: string;
  /**
   * Verify access to a resource (raw user input: id or URL) and ensure the
   * expected structure exists. `forceStructure` re-applies headers/tables.
   */
  connect(token: string, input: string, options?: { forceStructure?: boolean }): Promise<StoreResource>;
  /** Create a fresh, fully structured store. */
  create?(token: string): Promise<StoreResource>;
  getInfo(token: string, resourceId: string): Promise<StoreResource>;
  listExpenses(token: string, resourceId: string): Promise<Expense[]>;
  appendExpense(token: string, resourceId: string, input: NewExpense, source?: string): Promise<Expense>;
  updateExpense(token: string, resourceId: string, expenseId: string, input: NewExpense): Promise<Expense>;
  deleteExpense(token: string, resourceId: string, expenseId: string): Promise<void>;
  readSettings(token: string, resourceId: string): Promise<Settings>;
  writeSettings(token: string, resourceId: string, settings: Settings): Promise<void>;
}
