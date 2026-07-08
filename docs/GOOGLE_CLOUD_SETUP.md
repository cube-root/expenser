# Google Cloud setup

MyExpense acts as the signed-in user via OAuth — there is **no service account and no sheet sharing**. You only need a Google Cloud project with two APIs enabled and an OAuth client. Takes about 10 minutes.

## 1. Create a project

1. Go to the [Google Cloud Console](https://console.cloud.google.com).
2. Click the project picker in the top bar → **New Project**.
3. Name it anything (e.g. `myexpense`) and click **Create**, then switch to it.

## 2. Enable the APIs

The app calls the Sheets API (read/write expense rows) and the Drive API (create the sheet, re-discover it later).

1. Go to **APIs & Services → Library**.
2. Search for **Google Sheets API** → **Enable**.
3. Search for **Google Drive API** → **Enable**.

## 3. Configure the consent screen (required before clients can be created)

New projects use the **Google Auth Platform** pages. Until this wizard is done, the Clients page shows *"You haven't configured any OAuth clients for this project yet"* and won't let you create one.

1. Go to **Google Auth Platform → Get started** (search "Google Auth Platform" in the console, or follow the banner on the Clients page).
2. **App information**: app name (e.g. `MyExpense`) and user support email.
3. **Audience**: choose **External** (unless everyone is in one Workspace org, then Internal is simpler).
4. **Contact information**: your email → agree to the user data policy → **Create**.
5. Go to **Google Auth Platform → Data access → Add or remove scopes** and add:
   - `https://www.googleapis.com/auth/spreadsheets`
   - `https://www.googleapis.com/auth/drive.file`
   - `openid`, `.../auth/userinfo.email`, `.../auth/userinfo.profile` (usually pre-selected)
6. Go to **Google Auth Platform → Audience** and add the Google account(s) you'll log in with under **Test users**.

> While the app is in **Testing** mode only the test users you list can log in, and refresh tokens expire after 7 days — fine for development. For real use, publish the app (see step 6).

*(On older projects the same settings live under **APIs & Services → OAuth consent screen**.)*

## 4. Create the OAuth client ID

1. Go to **Google Auth Platform → Clients → + Create client** (or **APIs & Services → Credentials → + Create credentials → OAuth client ID** — both open the same *Create OAuth client ID* form).
2. Fill in the form:

   | Field | Value |
   |---|---|
   | **Application type** | Web application |
   | **Name** | `myexpense-web` (only shown in the console) |
   | **Authorized JavaScript origins** | `http://localhost:3000` — and `https://<your-domain>` for production |
   | **Authorized redirect URIs** | `http://localhost:3000/api/auth/callback/google` — and `https://<your-domain>/api/auth/callback/google` for production |

3. Click **Create**. A dialog shows the **Client ID** (`…apps.googleusercontent.com`) and **Client secret** — copy both now (you can also download the JSON, or reopen the client later to view them).
4. These become `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` in the next step.

> You can add the production origin/redirect URI later — edits to an existing client take effect within a few minutes, no new client needed.

## 5. Set the environment variables

Locally:

```bash
cp .env.example .env.local
npx auth secret   # fills AUTH_SECRET, or paste its output manually
```

```dotenv
AUTH_SECRET=<output of `npx auth secret`>
AUTH_GOOGLE_ID=<client id>.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=<client secret>
```

On **Vercel**: add the same three variables under Project → Settings → Environment Variables, and make sure the production redirect URI from step 4 matches your deployed domain.

Then run `npm run dev`, open http://localhost:3000, and log in — Google will show a consent screen asking for the Sheets and Drive permissions.

## 6. Going to production (publishing)

`spreadsheets` and `drive.file` are **sensitive scopes**. In Testing mode you can use the app yourself indefinitely (re-consenting weekly). To let anyone log in without the "unverified app" warning:

1. On the OAuth consent screen page, click **Publish app**.
2. Google will prompt for verification because of the sensitive scopes — you'll need a privacy policy URL and a short justification video/description of why the app needs Sheets access.
3. Until verification completes, users can still proceed via **Advanced → Go to app (unsafe)** on the warning screen.

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| `redirect_uri_mismatch` on login | The redirect URI in step 4 must match the origin exactly (scheme, host, port, and the `/api/auth/callback/google` path). |
| `access_denied` for a teammate | They're not in the **Test users** list while the app is in Testing mode. |
| Login works but Sheets calls fail with 403 | Sheets/Drive API not enabled (step 2), or the scopes weren't added to the consent screen (step 3). |
| Logged out / re-consent after 7 days | Normal in Testing mode — refresh tokens expire. Publish the app to lift it. |
| `UntrustedHost` error in server logs | Set `AUTH_URL` to your origin (only needed off-Vercel). |
