<h1 align="center">MyExpense</h1>

<p align="center">Track your spending in your own Google Sheet — the sheet <em>is</em> the database.</p>

## How it works

1. **Login with Google or Airtable** — your login choice picks the backend.
2. **Connect a store** — Google: one click creates a ready-made spreadsheet, or pick an existing one in Google's file dialog. Airtable: grant a base during login and pick it.
3. **Add expenses** — entries are appended straight to your sheet/base. Dashboard, filters and budgets read from it live.

**Minimal permissions by design**: with Google the app uses only the `drive.file` scope (it can touch only spreadsheets *it created* or ones *you explicitly picked*); with Airtable it can access only the bases *you grant* on the consent screen. Neither can see anything else in your account. There is also **no database and no server-side storage**: user settings live in a hidden `Config` tab/table, the OAuth tokens live in an encrypted session cookie, and the connected store id lives in an httpOnly cookie.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- [Auth.js](https://authjs.dev) with Google OAuth (`drive.file` only — non-sensitive, per-file) or Airtable OAuth (per-base grants)
- Storage adapters over the Google Sheets/Drive/Picker APIs and the Airtable Web API (no service account)
- Tailwind CSS + [shadcn/ui](https://ui.shadcn.com), Recharts, SWR
- PWA (installable on mobile)

## Sheet schema

`Expenses` tab, columns A–N:

| Id | CreatedAt | Date | Month | Amount | Currency | Category | Type | PaymentMode | Note | Tags | Source | SplitTotal | SplitWith |
|----|-----------|------|-------|--------|----------|----------|------|-------------|------|------|--------|-----------|-----------|

When an expense is split with friends, `Amount` is **your share** (what analytics count), `SplitTotal` is the full bill, and `SplitWith` lists friends' shares as `Rahul: 300, Anna: 200`.

`Config` tab (hidden): `categories`, `paymentModes`, `defaultCurrency`, `monthlyBudget` as key/value rows.

## Development

```bash
cp .env.example .env.local   # fill in the values below
npm install
npm run dev
```

### Google OAuth setup

Follow the step-by-step guide: **[docs/GOOGLE_CLOUD_SETUP.md](docs/GOOGLE_CLOUD_SETUP.md)**. In short: enable the Sheets + Drive + Picker APIs, configure the OAuth consent screen, create a Web application OAuth client and an API key, and put them in `.env.local` with `AUTH_SECRET`.

### Airtable setup (optional second backend)

Follow **[docs/AIRTABLE_SETUP.md](docs/AIRTABLE_SETUP.md)**: register an OAuth integration at airtable.com/create/oauth and set `AUTH_AIRTABLE_ID`/`AUTH_AIRTABLE_SECRET`. Omit them to offer Google Sheets only.

## Deploy

Deploys as a standard Next.js app on [Vercel](https://vercel.com) — set the same environment variables and add the production redirect URI to the OAuth client.
