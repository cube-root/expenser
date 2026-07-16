# Service account setup

The optional service-account method lets a user share only one Google Sheet with MyExpense. The
initial Google login requests only basic identity information; the user does not grant the Google
Sheets OAuth scope. The service account cannot see other sheets unless someone explicitly shares
them with its email.

## 1. Create or select a Google Cloud project

1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Use the project selector in the top bar to create a project or select the project used by
   MyExpense.
3. Record the project ID for reference.

## 2. Enable the Google Sheets API

1. Go to **APIs & Services → Library**.
2. Search for **Google Sheets API**.
3. Open it and click **Enable**.

The Drive API and Google Picker API are not required for the service-account method.

## 3. Create the service account

1. Go to **IAM & Admin → Service Accounts**.
2. Click **Create service account**.
3. Enter a name such as `myexpense-sheets` and click **Create and continue**.
4. Do not grant project-level IAM roles; sheet access will be granted through Google Sheets sharing.
5. Click **Done**.

The new account has an email similar to:

```text
myexpense-sheets@your-project-id.iam.gserviceaccount.com
```

## 4. Create a JSON key

1. Open the service account.
2. Select **Keys → Add key → Create new key**.
3. Choose **JSON** and click **Create**.
4. Store the downloaded file securely. Google does not let you download that private key again.

Do not commit the JSON file, send it to the browser, or place the private key in a
`NEXT_PUBLIC_...` variable.

## 5. Configure MyExpense

Open the JSON key and copy `client_email` and `private_key` into `.env.local`:

```dotenv
GOOGLE_SERVICE_ACCOUNT_EMAIL=myexpense-sheets@your-project-id.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Keep the private key on one line with literal `\n` characters. On Vercel, add both values under
**Project → Settings → Environment Variables** and redeploy.

The “Share one sheet” switcher on `/setup` appears only when both variables are set.

## 6. Connect a sheet

1. Open the Google Sheet.
2. Click **Share**.
3. Paste the service-account email displayed by MyExpense.
4. Select **Editor** and click **Send**. Disable notification if Google offers it; service accounts
   do not have an inbox.
5. Copy the full Google Sheet URL.
6. In MyExpense, select **Share one sheet**, paste the URL, and click **Connect shared sheet**.

MyExpense first makes a read-only metadata request to verify that the service account can access
the sheet. It then initializes the required tabs and headers. The connected-sheet cookie is written
only after both verification and initialization succeed.

## Troubleshooting

| Problem | Fix |
|---|---|
| Service-account option is hidden | Set both environment variables and restart or redeploy the app. |
| “Cannot access this sheet” | Share the sheet with the exact displayed email as Editor, then retry. |
| Authentication fails | Confirm the email and private key came from the same JSON key and preserve the `\n` characters. |
| Sheets API returns 403 | Enable Google Sheets API in the service account's Cloud project. |
| Key may be exposed | Delete the key in Cloud Console, create a replacement, and update the environment immediately. |
