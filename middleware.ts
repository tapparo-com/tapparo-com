import { NextResponse, type NextRequest } from "next/server";
import { canonicalPublicPath } from "./lib/urls";

export function middleware(request: NextRequest) {
  const pathname = canonicalPublicPath(request.nextUrl.pathname);
  if (pathname === request.nextUrl.pathname) return NextResponse.next();

  // A cloned NextURL can restore its original trailing-slash flag on serialization.
  const destination = new URL(request.url);
  destination.pathname = pathname;
  return NextResponse.redirect(destination, 308);
}

export const config = {
  // Also guard these in canonicalPublicPath, including case/encoded variants.
  matcher: ["/((?!studio(?:/|$)|api(?:/|$)|_next(?:/|$)|_vercel(?:/|$)|.*\\.).*)"],
};
