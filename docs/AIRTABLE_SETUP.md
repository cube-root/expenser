# Airtable setup

MyExpense can use an **Airtable base** as its database instead of a Google Sheet. The trust model is the same minimal one: during login, Airtable asks the user **which bases to grant** — the app can only ever see those, never the rest of the workspace. Takes about 5 minutes.

## 1. Register the OAuth integration

1. Go to [airtable.com/create/oauth](https://airtable.com/create/oauth) (sign in first).
2. **Name**: `MyExpense` (users see this on the consent screen).
3. **OAuth redirect URL**: `http://localhost:3000/api/auth/callback/airtable` — add your production URL (`https://<your-domain>/api/auth/callback/airtable`) later. HTTPS is required except for localhost.
4. Under **Scopes**, enable:
   - `data.records:read` — read expense records
   - `data.records:write` — add/edit/delete expense records
   - `schema.bases:read` — see table/field structure
   - `schema.bases:write` — create the `Expenses` and `Config` tables in a granted base
   - `user.email:read` — show who's logged in
5. Save, then copy the **Client ID**, and generate a **Client secret**.

## 2. Set the environment variables

```dotenv
AUTH_AIRTABLE_ID=<client id>
AUTH_AIRTABLE_SECRET=<client secret>
```

Add the same two on Vercel for production. (Leave them empty to hide the Airtable option — Google Sheets keeps working on its own.)

## 3. How users connect a base

1. Click **Continue with Airtable** on the landing page.
2. Airtable's consent screen lists the requested permissions and asks **which bases/workspaces to grant** — the user adds the base they want to use (create an empty base at airtable.com first if needed).
3. On the setup page, the granted base appears — pick it, and the app creates two tables inside it:
   - **Expenses**: Category (primary), Date, Amount, Currency, Type, PaymentMode, Note, Tags, Month, Source, SplitTotal, SplitWith. The Airtable record id is the expense id, and the record's `createdTime` is the entry timestamp.
   - **Config**: Key/Value rows for categories, payment modes, default currency, monthly budget.
4. To grant another base later: Setup → **Grant a base** (re-runs the Airtable consent).

## Notes & limits

- **Refresh tokens rotate**: Airtable issues a new refresh token on every refresh (~hourly) and each lasts 60 days; the app stores the latest in the session cookie automatically. If a user is inactive for 60+ days they just log in again.
- **Free plan limits**: ~1,000 records per base and 5 requests/second — plenty for personal expense tracking.
- **Structure resync** (Settings → Resync structure) adds any missing tables/fields after app updates; it never touches records or other tables in the base.
- The app **cannot create bases** — Airtable's API requires workspace-level access for that, which would widen permissions. Users create an empty base themselves and grant it.

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| `redirect_uri_mismatch` | The redirect URL in the integration settings must exactly match `<origin>/api/auth/callback/airtable`. |
| No bases listed on setup | The user didn't add a base on the consent screen — click **Grant a base** to re-run consent and add one. |
| 403 on records calls | A scope is missing on the integration (all five from step 1 are required). |
| Base connects but tables look wrong | The base already had `Expenses`/`Config` tables with different field types — the app adds missing tables/fields but never mutates existing field types. Rename the old tables and resync. |
