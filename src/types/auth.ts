import { z } from 'zod';

export const SignupSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password is required')
});

export const AuthResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string(),
  data: z.object({
    user: z.object({
      uid: z.string(),
      email: z.string().email(),
      first_name: z.string(),
      last_name: z.string(),
      username: z.string(),
      isOnboarded: z.boolean().optional(),
      onboarding_completed: z.boolean().optional(),
      health_profile_verified: z.boolean().optional(),
      created_at: z.string().optional()
    }),
    access_token: z.string()
  })
});

export type SignupInput = z.infer<typeof SignupSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
