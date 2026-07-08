import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { SetupFlow } from '@/components/setup-flow';

export const metadata = { title: 'Connect your sheet' };

export default async function SetupPage() {
  const session = await auth();
  if (!session?.accessToken || session.error) redirect('/');
  return <SetupFlow userName={session.user?.name ?? ''} />;
}
