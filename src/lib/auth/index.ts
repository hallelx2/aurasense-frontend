import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { User } from 'next-auth';

// Dummy credentials for development
const DUMMY_USER: User = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  isOnboarded: false, // Default to false, will be updated after onboarding
};

const DUMMY_PASSWORD = 'password123';

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

        // Check against dummy credentials
        if (
          credentials.email === DUMMY_USER.email &&
          credentials.password === DUMMY_PASSWORD
        ) {
          return DUMMY_USER;
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
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub || '1';
        session.user.isOnboarded = token.isOnboarded as boolean;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    }
  }
};
