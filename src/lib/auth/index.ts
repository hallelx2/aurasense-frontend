import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Dummy credentials for development
const DUMMY_CREDENTIALS = {
  email: 'test@example.com',
  password: 'password123'
};

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
          credentials.email === DUMMY_CREDENTIALS.email &&
          credentials.password === DUMMY_CREDENTIALS.password
        ) {
          return {
            id: '1',
            email: DUMMY_CREDENTIALS.email,
            name: 'Test User',
          };
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
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub || '1';
      }
      return session;
    }
  }
};
