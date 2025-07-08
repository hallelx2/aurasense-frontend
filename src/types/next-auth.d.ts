import 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      isOnboarded: boolean;
      preferences?: {
        dietaryRestrictions?: string[];
        spiceTolerance?: number;
        culturalPreferences?: string[];
      };
      healthProfile?: {
        allergies?: string[];
        conditions?: string[];
      };
    };
    accessToken?: string;
  }

  interface User {
    id: string;
    email: string;
    name: string;
    isOnboarded: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    isOnboarded: boolean;
    accessToken?: string;
    preferences?: {
      dietaryRestrictions?: string[];
      spiceTolerance?: number;
      culturalPreferences?: string[];
    };
    healthProfile?: {
      allergies?: string[];
      conditions?: string[];
    };
  }
}
