import NextAuth from "next-auth";
import { authConfig } from "./src/auth.config";
import { generateRequestId } from "./src/lib/monitoring/request-id";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default NextAuth(authConfig).auth(async function middleware(_request: NextRequest) {
  // Generate and add request ID to headers
  const requestId = generateRequestId();

  // Create response with request ID header
  const response = NextResponse.next();
  response.headers.set('x-request-id', requestId);

  return response;
});

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
