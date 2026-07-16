'use client';

import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';
import type { Expense, Settings } from '@/lib/types';
import type { StoreResource } from '@/lib/storage/types';
import { ApiError, fetcher } from './fetcher';

/**
 * Redirect on auth/setup errors: 401 → landing (login), 428 → /setup,
 * 403/404 → /setup too (the connected sheet is gone or no longer granted
 * under the drive.file scope — re-picking it in the Picker restores access).
 * Shared by every data hook so any page recovers gracefully.
 */
function useApiErrorRedirect(error: unknown) {
  const router = useRouter();
  useEffect(() => {
    if (error instanceof ApiError) {
      if (error.status === 401) router.replace('/');
      if (error.status === 428) router.replace('/setup');
      if (error.status === 403 || error.status === 404) {
        toast.error('Can’t access your sheet anymore — pick it again to reconnect');
        router.replace('/setup');
      }
    }
  }, [error, router]);
}

export function useExpenses() {
  const swr = useSWR<{ expenses: Expense[] }>('/api/expenses', fetcher, {
    revalidateOnFocus: true,
  });
  useApiErrorRedirect(swr.error);
  return {
    expenses: swr.data?.expenses,
    isLoading: swr.isLoading,
    error: swr.error as ApiError | undefined,
    mutate: swr.mutate,
  };
}

export function useSettings() {
  const swr = useSWR<{ settings: Settings }>('/api/settings', fetcher, {
    revalidateOnFocus: false,
  });
  useApiErrorRedirect(swr.error);
  return {
    settings: swr.data?.settings,
    isLoading: swr.isLoading,
    error: swr.error as ApiError | undefined,
    mutate: swr.mutate,
  };
}

export function useSheetInfo() {
  const swr = useSWR<StoreResource>('/api/sheets/current', fetcher, {
    revalidateOnFocus: false,
  });
  useApiErrorRedirect(swr.error);
  return {
    sheet: swr.data,
    isLoading: swr.isLoading,
    error: swr.error as ApiError | undefined,
  };
}

/** Remember last-used form choices locally to minimize taps next time. */
export function getLastUsed(): { category?: string; paymentMode?: string; currency?: string } {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem('expenser:last-used') ?? '{}');
  } catch {
    return {};
  }
}

export function setLastUsed(values: { category?: string; paymentMode?: string; currency?: string }) {
  try {
    localStorage.setItem('expenser:last-used', JSON.stringify({ ...getLastUsed(), ...values }));
  } catch {
    // localStorage unavailable — non-fatal
  }
}
