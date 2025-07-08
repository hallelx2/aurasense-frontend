import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import SignupView from '@/modules/authentication/views/SignupView';

export default async function SignUpPage() {
  const session = await getServerSession(authOptions);

  // Redirect to dashboard if already authenticated
  if (session) {
    if (!session.user.isOnboarded) {
      redirect('/onboarding');
    }
    redirect('/dashboard');
  }

  return <SignupView />;
}
