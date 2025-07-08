import { OnboardingView } from '@/modules/onboarding/views/OnboardingView';
import { redirect } from 'next/navigation';

export default async function OnboardingPage() {
  // TODO: Replace with real session/user context and onboarding check
  const isOnboarded = false; // Placeholder
  if (isOnboarded) {
    redirect('/dashboard');
  }
  return <OnboardingView />;
}
