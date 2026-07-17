<h1 align="center">MyExpense</h1>

<p align="center">Track your spending in your own Google Sheet — the sheet <em>is</em> the database.</p>

## How it works

1. **Login with Google** — the initial login requests only basic identity information.
2. **Choose sheet access** — authorize Google Sheets to create or connect sheets as yourself, or
   share one specific sheet with the optional service account.
3. **Add expenses** — entries are appended straight to your sheet. Dashboard, filters and budgets read from it live.

The Google Sheets scope is requested incrementally only when a user chooses Google-account access.
The service-account method does not require the user to grant that scope and can access only sheets
explicitly shared with its email. The app does not request access to other Drive file types. There is
also **no database and no server-side storage**: user settings live in a hidden `Config` tab, OAuth
tokens live in an encrypted session cookie, and the connected sheet id lives in an httpOnly cookie.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- [Auth.js](https://authjs.dev) with basic Google login and incremental `spreadsheets` authorization
- Storage adapter over the Google Sheets API, with optional selected-sheet service-account access
- Tailwind CSS + [shadcn/ui](https://ui.shadcn.com), Recharts, SWR
- PWA (installable on mobile)

## Sheet schema

`Expenses` tab, columns A–O:

| Id | CreatedAt | Date | Month | Amount | Currency | Category | Type | PaymentMode | Note | Tags | Source | SplitTotal | SplitWith | SplitPaidBy |
|----|-----------|------|-------|--------|----------|----------|------|-------------|------|------|--------|-----------|-----------|-------------|

When an expense is split with friends, `Amount` is **your share** (what analytics count), `SplitTotal` is the full bill, `SplitWith` lists friends' shares as `Rahul: 300, Anna: 200`, and `SplitPaidBy` records who paid. The app uses these fields to calculate who owes whom.

`Config` tab (hidden): `categories`, `paymentModes`, `defaultCurrency`, `monthlyBudget` as key/value rows.

## Run locally

### Prerequisites

- Node.js 20 or newer
- npm
- A Google Cloud project
- A Google account added as an OAuth test user while the app is in Testing mode

### 1. Clone and install

```bash
git clone https://github.com/cube-root/expenser.git
cd expenser
npm ci
```

### 2. Configure Google OAuth

Follow **[Google Cloud setup](docs/GOOGLE_CLOUD_SETUP.md)** to enable the Sheets API, configure the
OAuth consent screen, and create a Web application OAuth client. For local development, configure:

```text
Origin:       http://localhost:3000
Redirect URI: http://localhost:3000/api/auth/callback/google
```

### 3. Create the local environment file

```bash
cp .env.example .env.local
npx auth secret
```

Fill in the generated secret and OAuth credentials:

```dotenv
AUTH_SECRET=<generated secret>
AUTH_GOOGLE_ID=<oauth client id>.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=<oauth client secret>
```

Environment files are ignored by Git. Never commit OAuth secrets or service-account keys.

### 4. Optional selected-sheet setup

Optionally configure `GOOGLE_SERVICE_ACCOUNT_EMAIL` and `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` to
offer a selected-sheet-only setup method. The option is hidden unless both are set. See the
**[service account setup guide](docs/SERVICE_ACCOUNT_SETUP.md)**.

```dotenv
GOOGLE_SERVICE_ACCOUNT_EMAIL=myexpense@project-id.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### 5. Start the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), sign in with a configured test account, choose
an access method, and connect or create a sheet. Restart the development server after changing
environment variables.

### Validation commands

Run these before opening a pull request:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Contributing

Contributions are welcome. For a focused review and a clean history:

1. Fork the repository and create a branch from the current default branch:

   ```bash
   git checkout -b fix/short-description
   ```

2. Install with `npm ci` and configure `.env.local` from `.env.example`.
3. Keep changes scoped to one feature or fix. Avoid unrelated formatting and lockfile changes.
4. Preserve compatibility with existing Google Sheets. If the sheet schema changes:
   - append new columns instead of reordering existing columns;
   - provide defaults for rows created by older versions;
   - ensure **Resync structure** can add the new headers without changing expense rows.
5. Never add credentials, downloaded service-account JSON files, personal sheet IDs, or production
   data to commits, screenshots, fixtures, logs, or pull requests.
6. Run lint, TypeScript, and the production build.
7. Open a pull request explaining:
   - what changed and why;
   - how it was tested;
   - any environment, OAuth, cookie, or sheet-schema changes;
   - screenshots for visible UI changes.

When reporting a bug, include reproduction steps, expected and actual behavior, browser/runtime
details, and sanitized error output. Remove access tokens, cookies, email addresses, sheet IDs, and
private URLs before posting.

## Deploy

Deploys as a standard Next.js app on [Vercel](https://vercel.com) — set the same environment variables and add the production redirect URI to the OAuth client.

### Release and deploy

Production releases use the **Release and deploy** GitHub Actions workflow. Local production
releases are intentionally blocked.

Configure these GitHub Actions secrets, preferably on a protected `production` environment:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

Follow the complete **[Vercel GitHub Actions setup guide](docs/VERCEL_GITHUB_ACTIONS_SETUP.md)** to
create a scoped token, find the project IDs, protect the production environment, and run a release.

In **Settings → Actions → General → Workflow permissions**, allow **Read and write permissions** so
the workflow's `GITHUB_TOKEN` can push the version commit and tag. If `main` has a ruleset that
blocks automation pushes, allow this workflow to bypass that rule or use an approved release token.

To release, open **GitHub → Actions → Release and deploy → Run workflow**, choose `patch`, `minor`,
or `major`, and run it from `main`. The workflow validates the project, uses release-it to bump
`package.json` and `package-lock.json`, creates and pushes the release commit and `vX.Y.Z` tag, and
then deploys that exact release to Vercel production. npm publishing remains disabled. Deployment
does not run if the Git push fails.
