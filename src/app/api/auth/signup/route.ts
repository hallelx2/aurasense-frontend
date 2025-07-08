import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { z } from 'zod';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

// Validation schema for registration data
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  username: z.string().min(3),
  first_name: z.string().min(2),
  last_name: z.string().min(2),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = registerSchema.parse(body);

    // Forward the registration request to the backend
    const response = await axios.post(`${BACKEND_URL}/api/v1/auth/register`, validatedData, {
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
