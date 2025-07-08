import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import LoginView from '@/modules/authentication/views/LoginView';

export default async function SignInPage() {
  const session = await getServerSession(authOptions);

  // Redirect to dashboard if already authenticated
  if (session) {
    if (!session.user.isOnboarded) {
      redirect('/onboarding');
    }
    redirect('/dashboard');
  }

  return <LoginView />;
}
