import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Call your backend to update the user's onboarding status
    const response = await fetch(`${BACKEND_URL}/api/v1/users/onboard`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        uid: session.user.id,
        preferences: {
          dietary_preferences: ["balanced", "vegetable-rich", "lean-protein"],
          dietary_restrictions: ["lactose-intolerant"],
          allergies: ["peanuts", "shellfish"],
          community_interests: ["healthy-cooking", "meal-prep", "international-cuisine"]
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Backend error:', errorData);
      throw new Error(errorData.message || 'Failed to update onboarding status');
    }

    const data = await response.json();
    console.log('Onboarding response:', data);

    return NextResponse.json({
      status: 'success',
      message: 'Onboarding completed successfully',
      data: data
    });
  } catch (error) {
    console.error('Error updating onboarding status:', error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}
