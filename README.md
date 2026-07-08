<h1 align="center">MyExpense</h1>

<p align="center">Track your spending in your own Google Sheet — the sheet <em>is</em> the database.</p>

## How it works

1. **Login with Google** — the app asks for the Google Sheets scope and acts as *you*.
2. **Connect a sheet** — one click creates a ready-made spreadsheet in your Drive, or paste a link to an existing one.
3. **Add expenses** — entries are appended straight to the sheet. Dashboard, filters and budgets read from it live.

There is **no database and no server-side storage**: user settings live in a hidden `Config` tab of the spreadsheet, the OAuth tokens live in an encrypted session cookie, and the connected sheet id lives in an httpOnly cookie.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- [Auth.js](https://authjs.dev) with Google OAuth (`spreadsheets` + `drive.file` scopes)
- Google Sheets & Drive REST APIs (no service account)
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

Follow the step-by-step guide: **[docs/GOOGLE_CLOUD_SETUP.md](docs/GOOGLE_CLOUD_SETUP.md)**. In short: enable the Sheets + Drive APIs, configure the OAuth consent screen, create a Web application OAuth client, and put the client id/secret + `AUTH_SECRET` in `.env.local`.

## Deploy

Deploys as a standard Next.js app on [Vercel](https://vercel.com) — set the same environment variables and add the production redirect URI to the OAuth client.
