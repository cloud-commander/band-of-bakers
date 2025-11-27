import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth((req) => {
  // Log auth state for debugging
  const isLoggedIn = !!req.auth?.user;
  console.log(`[Middleware] ${req.nextUrl.pathname} - LoggedIn: ${isLoggedIn}`);
});

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
