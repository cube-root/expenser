import type { Expense, NewExpense, Settings } from '../types';

/** Which OAuth provider the user signed in with — determines the backend. */
export type StoreProvider = 'google' | 'airtable';

/** A connectable data store: a Google spreadsheet or an Airtable base. */
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
  /** Human name for UI copy ("Google Sheet", "Airtable base"). */
  storeNoun: string;
  /** Resources the user has granted to the app (for discovery/reconnect). */
  listAvailable(token: string): Promise<StoreResource[]>;
  /**
   * Verify access to a resource (raw user input: id or URL) and ensure the
   * expected structure exists. `forceStructure` re-applies headers/tables.
   */
  connect(token: string, input: string, options?: { forceStructure?: boolean }): Promise<StoreResource>;
  /** Create a fresh, fully structured store. Absent when unsupported (Airtable v1). */
  create?(token: string): Promise<StoreResource>;
  getInfo(token: string, resourceId: string): Promise<StoreResource>;
  listExpenses(token: string, resourceId: string): Promise<Expense[]>;
  appendExpense(token: string, resourceId: string, input: NewExpense, source?: string): Promise<Expense>;
  updateExpense(token: string, resourceId: string, expenseId: string, input: NewExpense): Promise<Expense>;
  deleteExpense(token: string, resourceId: string, expenseId: string): Promise<void>;
  readSettings(token: string, resourceId: string): Promise<Settings>;
  writeSettings(token: string, resourceId: string, settings: Settings): Promise<void>;
}
