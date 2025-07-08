import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/food/:path*',
    '/travel/:path*',
    '/community/:path*',
    '/profile/:path*',
  ]
};
