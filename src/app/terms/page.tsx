import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal-page';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms governing the use of MyExpense.',
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="July 17, 2026">
      <section>
        <h2>Acceptance of terms</h2>
        <p>
          These Terms of Service govern your use of MyExpense. By accessing or using the service,
          you agree to these terms and the Privacy Policy. If you do not agree, do not use the
          service.
        </p>
      </section>

      <section>
        <h2>The service</h2>
        <p>
          MyExpense helps you record, organize, and review expenses using Google Sheets as the data
          store. Features may include dashboards, budgets, categories, and shared expense ledgers.
          You retain ownership and control of spreadsheets in your Google account.
        </p>
      </section>

      <section>
        <h2>Your account and responsibilities</h2>
        <p>You agree to:</p>
        <ul>
          <li>Provide accurate account information and protect access to your Google account.</li>
          <li>Use MyExpense only for lawful purposes.</li>
          <li>Not disrupt, abuse, reverse engineer, or attempt unauthorized access to the service.</li>
          <li>Ensure you have permission to add or share information about other people.</li>
          <li>Review important financial records and maintain any backups you require.</li>
        </ul>
      </section>

      <section>
        <h2>Google services</h2>
        <p>
          MyExpense integrates with Google Sign-In and Google Sheets. Your use of Google services is
          also governed by Google&apos;s applicable terms and policies. You can revoke MyExpense&apos;s
          access through your Google Account at any time. Revocation may prevent features that
          require Google Sheets from working.
        </p>
      </section>

      <section>
        <h2>Your content</h2>
        <p>
          You retain all rights to the data in your spreadsheets. You grant MyExpense only the
          limited permission necessary to access and process that data to provide features you
          request. You are responsible for the legality, accuracy, and availability of your content.
        </p>
      </section>

      <section>
        <h2>Availability and changes</h2>
        <p>
          The service is provided on an as-available basis. We may modify, suspend, or discontinue
          features and may update these terms. Continued use after updated terms are published means
          you accept the revised terms.
        </p>
      </section>

      <section>
        <h2>Disclaimer</h2>
        <p>
          MyExpense is a record-keeping tool and does not provide financial, tax, accounting, or
          legal advice. To the extent permitted by law, the service is provided without warranties
          of any kind, whether express or implied, including fitness for a particular purpose and
          non-infringement.
        </p>
      </section>

      <section>
        <h2>Limitation of liability</h2>
        <p>
          To the extent permitted by law, MyExpense and its developer will not be liable for
          indirect, incidental, special, consequential, or punitive damages, or for loss of data,
          profits, or business arising from your use of the service.
        </p>
      </section>

      <section>
        <h2>Termination</h2>
        <p>
          You may stop using MyExpense at any time by signing out and revoking its Google Account
          access. We may restrict access when reasonably necessary to protect the service, users, or
          comply with law. Ending use of MyExpense does not delete spreadsheets in your Google
          Drive.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Questions about these terms can be sent to{' '}
          <a href="mailto:abhijithababhijith@gmail.com">abhijithababhijith@gmail.com</a>.
        </p>
      </section>
    </LegalPage>
  );
}
