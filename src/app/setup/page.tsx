import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { SetupFlow } from '@/components/setup-flow';
import { isServiceAccountConfigured } from '@/lib/google/service-account';

export const metadata = { title: 'Connect your store' };

export default async function SetupPage() {
  const session = await auth();
  if (!session?.user) redirect('/');
  const serviceAccountEmail = isServiceAccountConfigured()
    ? process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
    : undefined;
  return (
    <SetupFlow
      userName={session.user.name ?? ''}
      serviceAccountEmail={serviceAccountEmail}
      hasSheetsAccess={session.hasSheetsAccess && !session.sheetsError}
    />
  );
}
