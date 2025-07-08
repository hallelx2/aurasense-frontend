import { NextAuthOptions } from 'next-auth';
import { RequestInternal } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

// Match the exact backend response structure
interface BackendResponse {
  status: string;
  message: string;
  data: {
    user: {
      uid: string;
      email: string;
      first_name: string;
      last_name: string;
      username: string;
      isOnboarded: boolean;
    };
    access_token: string;
  }
}

// Extend the built-in session type
declare module 'next-auth' {
  interface Session {
    accessToken: string;
    user: {
      id: string;
      email: string;
      name: string;
      username: string;
      first_name: string;
      last_name: string;
      isOnboarded: boolean;
    }
  }

  interface User {
    id: string;
    email: string;
    name: string;
    username: string;
    first_name: string;
    last_name: string;
    isOnboarded: boolean;
    accessToken: string;
  }
}

// Extend JWT type
declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string;
    isOnboarded: boolean;
    username: string;
    first_name: string;
    last_name: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials: Record<"email" | "password", string> | undefined, req: Pick<RequestInternal, "body" | "query" | "headers" | "method">) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            console.error('Backend authentication failed:', response.status);
            return null;
          }

          const result = await response.json() as BackendResponse;
          console.log('Login response:', result);

          if (result.status !== 'success' || !result.data?.user || !result.data?.access_token) {
            console.error('Backend authentication failed:', result.message);
            return null;
          }

          const { uid, email, username, first_name, last_name, isOnboarded } = result.data.user;
          const name = `${first_name} ${last_name}`;

          // Return user object with token
          return {
            id: uid,
            email,
            username,
            first_name,
            last_name,
            name,
            isOnboarded,
            accessToken: result.data.access_token,
          } as any; // Type assertion needed due to NextAuth's internal type constraints
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log('JWT callback - user data:', user);
        token.accessToken = user.accessToken;
        token.isOnboarded = user.isOnboarded;
        token.username = user.username;
        token.first_name = user.first_name;
        token.last_name = user.last_name;
      }
      console.log('JWT callback - final token:', token);
      return token;
    },

    async session({ session, token }) {
      console.log('Session callback - token:', token);
      if (session.user) {
        session.accessToken = token.accessToken;
        session.user.id = token.sub as string;
        session.user.username = token.username as string;
        session.user.first_name = token.first_name as string;
        session.user.last_name = token.last_name as string;
        session.user.isOnboarded = token.isOnboarded as boolean;
      }
      console.log('Session callback - final session:', session);
      return session;
    },
  },

  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signin',
    error: '/auth/error',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  debug: process.env.NODE_ENV === 'development',

  secret: process.env.NEXTAUTH_SECRET,
};
