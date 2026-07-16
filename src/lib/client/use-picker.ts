'use client';

import { useCallback, useRef } from 'react';

/**
 * Google Picker integration. Under the drive.file scope the app can only
 * access files it created — picking a file in Google's own dialog is what
 * grants the app access to that specific file (and nothing else).
 *
 * Requires:
 * - NEXT_PUBLIC_GOOGLE_API_KEY    — browser API key (Picker's developerKey)
 * - NEXT_PUBLIC_GOOGLE_PROJECT_NUMBER — Cloud project number (setAppId);
 *   must match the OAuth client's project or the drive.file grant won't
 *   register to this app.
 */

const PICKER_SCRIPT = 'https://apis.google.com/js/api.js';

let pickerReady: Promise<void> | null = null;

function loadPicker(): Promise<void> {
  if (pickerReady) return pickerReady;
  pickerReady = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = PICKER_SCRIPT;
    script.async = true;
    script.onload = () => gapi.load('picker', () => resolve());
    script.onerror = () => {
      pickerReady = null; // allow retry
      reject(new Error('Failed to load Google Picker'));
    };
    document.head.appendChild(script);
  });
  return pickerReady;
}

async function getAccessToken(): Promise<string> {
  const response = await fetch('/api/auth/session');
  const session = await response.json().catch(() => null);
  if (!session?.accessToken) throw new Error('Not signed in');
  return session.accessToken as string;
}

export function usePicker() {
  // The picker instance must stay referenced while open.
  const activePicker = useRef<unknown>(null);

  /** Opens the Google file picker; resolves with the picked spreadsheet id, or null on cancel. */
  const openPicker = useCallback(async (): Promise<string | null> => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    const projectNumber = process.env.NEXT_PUBLIC_GOOGLE_PROJECT_NUMBER;
    if (!apiKey || !projectNumber) {
      throw new Error(
        'Picker is not configured — set NEXT_PUBLIC_GOOGLE_API_KEY and NEXT_PUBLIC_GOOGLE_PROJECT_NUMBER',
      );
    }
    const [token] = await Promise.all([getAccessToken(), loadPicker()]);

    return new Promise<string | null>((resolve) => {
      const view = new google.picker.DocsView(google.picker.ViewId.SPREADSHEETS)
        .setMimeTypes('application/vnd.google-apps.spreadsheet')
        .setIncludeFolders(false);

      const picker = new google.picker.PickerBuilder()
        .setOAuthToken(token)
        .setDeveloperKey(apiKey)
        .setAppId(projectNumber)
        .addView(view)
        .setTitle('Pick your expense spreadsheet')
        .setCallback((data: { action: string; docs?: { id: string }[] }) => {
          if (data.action === google.picker.Action.PICKED) {
            resolve(data.docs?.[0]?.id ?? null);
          } else if (data.action === google.picker.Action.CANCEL) {
            resolve(null);
          }
        })
        .build();
      activePicker.current = picker;
      picker.setVisible(true);
    });
  }, []);

  return { openPicker };
}
