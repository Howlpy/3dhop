// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/login",
  },
  // Add logic to redirect users with active sessions away from login/register
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    '/auth/login', 
    '/auth/register' // Include these routes for session checking
  ], 
};