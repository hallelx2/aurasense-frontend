import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { DashboardView } from '@/modules/dashboard/views/DashboardView';
import { authOptions } from '@/lib/auth';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/signin');
  }

  return (
    <DashboardView />
  );
}
