import { sheetsAdapter } from './sheets-adapter';
import type { StorageAdapter } from './types';

export function getAdapter(): StorageAdapter {
  return sheetsAdapter;
}

export type { StorageAdapter, StoreResource } from './types';
