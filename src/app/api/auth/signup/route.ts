import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { z } from 'zod';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate what the frontend sends
    const { name, email, password } = signupSchema.parse(body);

    // Derive additional fields for the backend
    const nameParts = name.split(' ');
    const first_name = nameParts[0];
    const last_name = nameParts.slice(1).join(' ') || first_name;
    const username = email.split('@')[0];

    const backendData = {
      email,
      password,
      first_name,
      last_name,
      username,
    };

    // Forward the complete data to the backend's register endpoint
    const response = await axios.post(`${BACKEND_URL}/api/v1/auth/register`, backendData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Return the exact response from backend
    return NextResponse.json(response.data);
  } catch (error: any) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { detail: 'Validation error', errors: error.errors },
        { status: 400 }
      );
    }

    console.error('Registration error:', error.response?.data || error.message);

    // Return the exact error format from backend
    return NextResponse.json(
      error.response?.data || { detail: 'Registration failed' },
      { status: error.response?.status || 500 }
    );
  }
}
