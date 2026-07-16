# Google Cloud setup

MyExpense first requests only basic Google identity scopes. If a user chooses Google-account sheet
access during setup, the app then requests the Google Sheets scope incrementally so it can create,
read, and edit spreadsheets as that user. Users who choose the service-account method never need to
grant the Sheets scope. The scope is sensitive and can access every spreadsheet the signed-in user
can access, so a public deployment may require Google OAuth verification.

## 1. Create a project and enable Sheets

1. Create or select a project in the [Google Cloud Console](https://console.cloud.google.com).
2. Go to **APIs & Services → Library**.
3. Enable **Google Sheets API**.

The Drive API, Google Picker API, browser API key, and project number are not required.

## 2. Configure the consent screen

1. Go to **Google Auth Platform → Get started**.
2. Enter the app information and choose **External**, unless everyone belongs to one Workspace
   organization.
3. Under **Data access**, add:
   - `https://www.googleapis.com/auth/spreadsheets`
   - `openid`
   - `https://www.googleapis.com/auth/userinfo.email`
   - `https://www.googleapis.com/auth/userinfo.profile`
4. While the app is in Testing mode, add every account that will use it under **Test users**.

## 3. Create the OAuth client

Create a **Web application** OAuth client with:

| Field | Local value |
|---|---|
| Authorized JavaScript origin | `http://localhost:3000` |
| Authorized redirect URI | `http://localhost:3000/api/auth/callback/google` |

Add the equivalent HTTPS origin and callback URI for production.

## 4. Set environment variables

```dotenv
AUTH_SECRET=<a strong random secret>
AUTH_GOOGLE_ID=<client id>.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=<client secret>
```

Remove `NEXT_PUBLIC_GOOGLE_API_KEY` and `NEXT_PUBLIC_GOOGLE_PROJECT_NUMBER` if they were configured
for the old Picker flow.

The first login shows only basic profile consent. The Sheets consent screen appears later, after the
user chooses **Google account** on the setup page. After changing configured scopes, users may need
to sign out and authorize Sheets again.

## Optional: selected-sheet access with a service account

For the complete walkthrough, see **[Service account setup](SERVICE_ACCOUNT_SETUP.md)**.

To show the service-account option on `/setup`, configure both variables:

```dotenv
GOOGLE_SERVICE_ACCOUNT_EMAIL=<service-account-name>@<project-id>.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Create the service account under **IAM & Admin → Service Accounts**, create a JSON key, and copy its
`client_email` and `private_key` values into the variables above. The setup option remains hidden
unless both variables are present. Users must share their selected Google Sheet with the displayed
email as an Editor before connecting it. Never expose the private key through a public environment
variable or commit it to source control.

## Production

`https://www.googleapis.com/auth/spreadsheets` is a sensitive scope. A public External app must
complete Google's OAuth verification process. Testing-mode users can use the app without publishing,
but their refresh tokens may expire after seven days.

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| `redirect_uri_mismatch` | The configured redirect URI must exactly match the app origin and `/api/auth/callback/google`. |
| `access_denied` | Add the account under Test users while the app is in Testing mode. |
| Sheets authorization is required | Return to setup, choose **Google account**, and complete the separate Sheets consent. |
| Sheets calls return 403 | Enable the Sheets API, add the Sheets scope to Data access, then authorize Sheets again. |
| Existing sheet cannot connect | Confirm the signed-in Google account can edit it and paste its full Google Sheets URL. |
