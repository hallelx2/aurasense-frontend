import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { DashboardView } from '@/modules/dashboard/views/DashboardView';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // Debug log to see what session data we're getting
  console.log('Dashboard page - session:', JSON.stringify(session, null, 2));

  if (!session || !session.user) {
    console.log('No session or user, redirecting to signin');
    redirect('/auth/signin');
  }

  // Safely check for onboarding status
  const isOnboarded = session.user.isOnboarded ?? false;

  if (!isOnboarded) {
    console.log('User not onboarded, redirecting to onboarding');
    redirect('/onboarding');
  }

  return (
    <DashboardView
      user={session.user}
    />
  );
}
