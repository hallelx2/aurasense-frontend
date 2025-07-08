import 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    accessToken: string;
    user: {
      id: string;
      email: string;
      name: string;
      isOnboarded: boolean;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    isOnboarded: boolean;
    accessToken: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string;
    isOnboarded: boolean;
  }
}
