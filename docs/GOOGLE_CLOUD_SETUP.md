# Google Cloud setup

MyExpense acts as the signed-in user via OAuth — there is **no service account and no sheet sharing**. It uses only the **`drive.file` scope** (non-sensitive): the app can access *only* spreadsheets it creates or ones the user explicitly picks in Google's file dialog — never the rest of their Drive or other sheets. You need a Google Cloud project with three APIs enabled, an OAuth client, and one API key. Takes about 10 minutes.

## 1. Create a project

1. Go to the [Google Cloud Console](https://console.cloud.google.com).
2. Click the project picker in the top bar → **New Project**.
3. Name it anything (e.g. `myexpense`) and click **Create**, then switch to it.

## 2. Enable the APIs

The app calls the Sheets API (read/write expense rows), the Drive API (create the sheet, re-discover it later), and the Picker API (the "pick an existing sheet" dialog).

1. Go to **APIs & Services → Library**.
2. Search for **Google Sheets API** → **Enable**.
3. Search for **Google Drive API** → **Enable**.
4. Search for **Google Picker API** → **Enable**.

## 3. Configure the consent screen (required before clients can be created)

New projects use the **Google Auth Platform** pages. Until this wizard is done, the Clients page shows *"You haven't configured any OAuth clients for this project yet"* and won't let you create one.

1. Go to **Google Auth Platform → Get started** (search "Google Auth Platform" in the console, or follow the banner on the Clients page).
2. **App information**: app name (e.g. `MyExpense`) and user support email.
3. **Audience**: choose **External** (unless everyone is in one Workspace org, then Internal is simpler).
4. **Contact information**: your email → agree to the user data policy → **Create**.
5. Go to **Google Auth Platform → Data access → Add or remove scopes** and add:
   - `https://www.googleapis.com/auth/drive.file` — the only data scope; it's **non-sensitive** (per-file access granted by the user's own picks)
   - `openid`, `.../auth/userinfo.email`, `.../auth/userinfo.profile` (usually pre-selected)

   > Do **not** add `.../auth/spreadsheets` — the app doesn't use it, and adding it would make the consent screen sensitive and trigger Google's verification requirements.
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

## 5. Create the API key (for the file picker)

The "Use an existing sheet" flow opens Google's file picker, which needs a browser API key alongside the OAuth token.

1. Go to **APIs & Services → Credentials → + Create credentials → API key** and copy it.
2. Click the key to restrict it (recommended since it ships to the browser):
   - **API restrictions**: restrict to **Google Picker API**.
   - **Website restrictions**: add `http://localhost:3000` and your production domain.
3. Also note your **project number** (a numeric id, distinct from the project *ID*): it's on the **Cloud Console dashboard** for the project (or **IAM & Admin → Settings**). The picker needs it so files the user picks get granted to this app.

## 6. Set the environment variables

Locally:

```bash
cp .env.example .env.local
npx auth secret   # fills AUTH_SECRET, or paste its output manually
```

```dotenv
AUTH_SECRET=<output of `npx auth secret`>
AUTH_GOOGLE_ID=<client id>.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=<client secret>
NEXT_PUBLIC_GOOGLE_API_KEY=<API key from step 5>
NEXT_PUBLIC_GOOGLE_PROJECT_NUMBER=<project number from step 5>
```

On **Vercel**: add the same five variables under Project → Settings → Environment Variables, and make sure the production redirect URI from step 4 matches your deployed domain.

Then run `npm run dev`, open http://localhost:3000, and log in — the consent screen only asks to *"see, edit, create and delete the specific Google Drive files you use with this app"*.

## 7. Going to production (publishing)

`drive.file` is a **non-sensitive** scope, so publishing is light:

1. On the **Google Auth Platform → Audience** page (or OAuth consent screen on older consoles), click **Publish app**.
2. Because the app requests no sensitive or restricted scopes, **no security verification, demo video, or review is required** — publishing mainly lifts the test-user list and the 7-day refresh-token expiry.
3. Keep it that way: if you ever add a sensitive scope (like `.../auth/spreadsheets`), Google verification kicks in.

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| `redirect_uri_mismatch` on login | The redirect URI in step 4 must match the origin exactly (scheme, host, port, and the `/api/auth/callback/google` path). |
| `access_denied` for a teammate | They're not in the **Test users** list while the app is in Testing mode. |
| Login works but Sheets calls fail with 403 | Sheets/Drive API not enabled (step 2), or the scopes weren't added to the consent screen (step 3). |
| 403/404 on a sheet that used to work | The sheet was connected before the app switched to the `drive.file` scope (or was picked with a different Cloud project). Re-pick it via Setup → "Pick from Google Drive". |
| Picker doesn't open / "not configured" | `NEXT_PUBLIC_GOOGLE_API_KEY` / `NEXT_PUBLIC_GOOGLE_PROJECT_NUMBER` missing, Picker API not enabled, or the API key's website restriction doesn't include your origin. |
| Picked file still not accessible | `NEXT_PUBLIC_GOOGLE_PROJECT_NUMBER` must be the project **number** of the SAME project as the OAuth client, otherwise the pick doesn't grant access to this app. |
| Logged out / re-consent after 7 days | Normal in Testing mode — refresh tokens expire. Publish the app to lift it. |
| `UntrustedHost` error in server logs | Set `AUTH_URL` to your origin (only needed off-Vercel). |
