import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { OnboardingView } from '@/modules/onboarding/views/OnboardingView';

export default async function OnboardingPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/auth/signin');
  }

  return <OnboardingView />;
}
