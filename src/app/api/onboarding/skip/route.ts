import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Mark onboarding as completed in the backend
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/onboarding/skip`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.accessToken}`,
          },
        }
      );
      
      // Return success response with updated user info
      return NextResponse.json({
        success: true,
        message: 'Onboarding skipped successfully',
        user: response.data.user,
      });
      
    } catch (backendError) {
      console.error('Backend skip endpoint error:', backendError);
      return NextResponse.json(
        { error: 'Failed to skip onboarding in backend' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error skipping onboarding:', error);
    return NextResponse.json(
      { error: 'Failed to skip onboarding' },
      { status: 500 }
    );
  }
}