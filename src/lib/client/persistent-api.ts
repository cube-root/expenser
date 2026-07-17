'use client';

import { useCallback, useEffect, useState } from 'react';
import { fetcher } from './fetcher';

const PREFIX = 'expenser:api-cache:';
const pendingRequests = new Map<string, Promise<unknown>>();

function cacheKey(url: string) {
  return `${PREFIX}${url}`;
}

export function clearPersistentApiCache() {
  if (typeof window === 'undefined') return;
  for (let index = localStorage.length - 1; index >= 0; index -= 1) {
    const key = localStorage.key(index);
    if (key?.startsWith(PREFIX)) localStorage.removeItem(key);
  }
}

export function removePersistentApiCache(url: string) {
  if (typeof window !== 'undefined') localStorage.removeItem(cacheKey(url));
}

export function setPersistentApiCache<T>(url: string, value: T) {
  if (typeof window !== 'undefined') localStorage.setItem(cacheKey(url), JSON.stringify(value));
}

export function usePersistentApi<T>(url: string) {
  const [data, setData] = useState<T>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>();

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      let pending = pendingRequests.get(url) as Promise<T> | undefined;
      if (!pending) {
        pending = fetcher<T>(url).finally(() => pendingRequests.delete(url));
        pendingRequests.set(url, pending);
      }
      const value = await pending;
      localStorage.setItem(cacheKey(url), JSON.stringify(value));
      setData(value);
      setError(undefined);
      return value;
    } catch (caught) {
      setError(caught);
      throw caught;
    } finally {
      setIsLoading(false);
    }
  }, [url]);

  const mutate = useCallback(async (value?: T, options?: { revalidate?: boolean }) => {
    if (value !== undefined) {
      localStorage.setItem(cacheKey(url), JSON.stringify(value));
      setData(value);
    }
    if (options?.revalidate === false) return value;
    return refresh();
  }, [refresh, url]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(cacheKey(url));
      if (stored) {
        const value = JSON.parse(stored) as T;
        queueMicrotask(() => {
          setData(value);
          setIsLoading(false);
        });
        return;
      }
    } catch {
      localStorage.removeItem(cacheKey(url));
    }
    queueMicrotask(() => refresh().catch(() => undefined));
  }, [refresh, url]);

  return { data, isLoading, error, refresh, mutate };
}
