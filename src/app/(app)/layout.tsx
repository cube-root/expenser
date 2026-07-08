import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { auth } from '@/auth';
import { SHEET_COOKIE } from '@/lib/api-helpers';
import { AppNav } from '@/components/app-nav';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.accessToken || session.error) redirect('/');
  if (!(await cookies()).get(SHEET_COOKIE)?.value) redirect('/setup');

  return (
    <div className="flex flex-1 flex-col">
      <AppNav
        user={{
          name: session.user?.name ?? '',
          image: session.user?.image ?? '',
        }}
      />
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 pb-24 pt-4 sm:pb-8">{children}</main>
    </div>
  );
}
