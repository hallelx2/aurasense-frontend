import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Just validate that we received the data
    const data = await request.json();
    const {
      dietaryPreferences,
      restrictions,
      allergies,
      voiceSample,
      communityInterests,
      spiceTolerance,
    } = data;

    // For now, just return success
    // You can add database storage or other persistence methods here later
    return NextResponse.json({
      success: true,
      message: 'Onboarding data received successfully',
    });
  } catch (error) {
    console.error('Error completing onboarding:', error);
    return NextResponse.json(
      { error: 'Failed to complete onboarding' },
      { status: 500 }
    );
  }
}
