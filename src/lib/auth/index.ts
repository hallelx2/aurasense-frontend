import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { User } from 'next-auth';
import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

interface BackendAuthResponse {
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
      onboarding_completed?: boolean;
    };
    access_token: string;
  };
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await axios.post<BackendAuthResponse>(`${BACKEND_URL}/api/v1/auth/login`, {
            email: credentials.email,
            password: credentials.password
          });

          if (response.data.status === 'success') {
            const { user, access_token } = response.data.data;

            return {
              id: user.uid,
              email: user.email,
              name: `${user.first_name} ${user.last_name}`,
              isOnboarded: user.isOnboarded || user.onboarding_completed || false,
              accessToken: access_token
            } as User & { accessToken: string };
          }
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }

        return null;
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.isOnboarded = user.isOnboarded;
        token.email = user.email;
        token.name = user.name;
        token.accessToken = (user as any).accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub || '';
        session.user.isOnboarded = token.isOnboarded as boolean;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.accessToken = token.accessToken as string;
      }
      return session;
    }
  }
};
