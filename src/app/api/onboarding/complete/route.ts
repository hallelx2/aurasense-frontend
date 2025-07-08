import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Just return success since we're handling the session update client-side
    return NextResponse.json({
      status: 'success',
      message: 'Onboarding completed successfully'
    });
  } catch (error) {
    console.error('Error updating onboarding status:', error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}
