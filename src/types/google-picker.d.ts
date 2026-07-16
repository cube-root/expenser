/* Minimal ambient declarations for the Google Picker client library
 * (loaded at runtime from apis.google.com — no npm package). */

/* eslint-disable @typescript-eslint/no-explicit-any */

declare const gapi: {
  load: (api: string, callback: () => void) => void;
};

declare namespace google {
  const picker: any;
}
