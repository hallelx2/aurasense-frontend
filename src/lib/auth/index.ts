import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { LoginInput, AuthResponse } from '@/types/auth';
import { authService } from '@/lib/api/auth';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const response = await authService.login({
            email: credentials.email,
            password: credentials.password
          });

          if (!response?.data?.user) {
            return null;
          }

          const { user, access_token } = response.data;

          return {
            id: user.uid,
            email: user.email,
            name: `${user.first_name} ${user.last_name}`,
            image: null,
            isOnboarded: user.isOnboarded,
            accessToken: access_token
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.isOnboarded = user.isOnboarded;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken;
        session.user.isOnboarded = token.isOnboarded;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
    newUser: '/auth/signup',
    error: '/auth/error'
  },
  session: {
    strategy: 'jwt'
  }
};
