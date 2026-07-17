import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal-page';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How MyExpense collects, uses, and protects Google user data.',
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="July 17, 2026">
      <section>
        <h2>Overview</h2>
        <p>
          MyExpense is an expense-tracking application that uses a Google Sheet as your data store.
          This policy explains what information MyExpense accesses, why it is needed, and the choices
          you have. By using MyExpense, you agree to the practices described here.
        </p>
      </section>

      <section>
        <h2>Information we access</h2>
        <p>When you sign in with Google, MyExpense receives:</p>
        <ul>
          <li>Your name, email address, profile image, and Google account identifier.</li>
          <li>
            OAuth access and refresh tokens required to keep you signed in and, when you separately
            grant Sheets access, to make Google Sheets API requests on your behalf.
          </li>
          <li>
            The contents and metadata of Google spreadsheets that MyExpense creates or that you
            choose to connect, including expenses, categories, budgets, settings, and shared-ledger
            information stored in those sheets.
          </li>
        </ul>
        <p>
          MyExpense requests the Google Sheets scope only when you choose Google-account sheet
          access. It does not request access to other Google Drive file types.
        </p>
      </section>

      <section>
        <h2>How we use information</h2>
        <p>We use this information only to:</p>
        <ul>
          <li>Authenticate you and display your account information.</li>
          <li>Create, connect, read, and update your expense-tracking Google Sheets.</li>
          <li>Provide dashboards, budgets, categories, settings, and shared-expense features.</li>
          <li>Maintain your session and protect the application from unauthorized access.</li>
        </ul>
        <p>
          Google user data is not used for advertising, sold, or transferred to third parties except
          as necessary to provide the service, comply with law, protect users, or with your explicit
          consent.
        </p>
      </section>

      <section>
        <h2>Storage and retention</h2>
        <p>
          Expense records and application settings are stored in Google Sheets in your Google
          account, not in a separate MyExpense application database. Authentication and connection
          information may be stored in secure session cookies on your device, including the tokens
          needed to access Google Sheets on your behalf. This information is retained for as long as
          needed to keep your session and connected features working.
        </p>
        <p>
          Signing out removes your active MyExpense session from that device. Disconnecting or
          revoking access does not delete your Google Sheets; you remain in control of those files
          and can delete them directly in Google Drive.
        </p>
      </section>

      <section>
        <h2>Security</h2>
        <p>
          We use reasonable technical safeguards, encrypted HTTPS connections, and Google OAuth to
          protect information. No internet service can guarantee absolute security, so you should
          also protect your Google account and devices.
        </p>
      </section>

      <section>
        <h2>Your choices and deletion</h2>
        <p>You can stop MyExpense from accessing your Google account at any time by:</p>
        <ul>
          <li>Signing out of MyExpense.</li>
          <li>
            Revoking MyExpense under your{' '}
            <a href="https://myaccount.google.com/connections" target="_blank" rel="noreferrer">
              Google Account third-party connections
            </a>
            .
          </li>
          <li>Deleting or unsharing connected spreadsheets in Google Drive.</li>
          <li>Emailing us to request deletion of any information under our control.</li>
        </ul>
      </section>

      <section>
        <h2>Google API Services User Data Policy</h2>
        <p>
          MyExpense&apos;s use and transfer of information received from Google APIs adheres to the{' '}
          <a
            href="https://developers.google.com/terms/api-services-user-data-policy"
            target="_blank"
            rel="noreferrer"
          >
            Google API Services User Data Policy
          </a>
          , including the Limited Use requirements.
        </p>
      </section>

      <section>
        <h2>Changes to this policy</h2>
        <p>
          We may update this policy as the service changes. The latest version and its effective date
          will always be published on this page.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          For privacy questions or deletion requests, email{' '}
          <a href="mailto:abhijithababhijith@gmail.com">abhijithababhijith@gmail.com</a>.
        </p>
      </section>
    </LegalPage>
  );
}
