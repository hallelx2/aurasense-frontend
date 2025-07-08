import 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      accessToken: string;
      first_name: string;
      last_name: string;
      username: string;
      uid: string;
      isOnboarded: boolean;
    }
  }

  interface User {
    accessToken: string;
    id: string;
    email: string;
    name: string;
    first_name: string;
    last_name: string;
    username: string;
    uid: string;
    isOnboarded: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string;
    uid: string;
    isOnboarded: boolean;
  }
}
