import { sheetsAdapter } from './sheets-adapter';
import { airtableAdapter } from '../airtable/adapter';
import type { StorageAdapter, StoreProvider } from './types';

export function getAdapter(provider: StoreProvider): StorageAdapter {
  return provider === 'airtable' ? airtableAdapter : sheetsAdapter;
}

export type { StorageAdapter, StoreProvider, StoreResource } from './types';
