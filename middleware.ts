import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE_NAME = "open-brain-auth";

// Routes that don't require auth
const PUBLIC_PATHS = ["/login", "/api/auth"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Allow static assets, manifest, favicon
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/icon-") ||
    pathname === "/manifest.webmanifest" ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".ico")
  ) {
    return NextResponse.next();
  }

  const password = process.env.DASHBOARD_PASSWORD;

  // If no password is set, allow all access (dev mode)
  if (!password) {
    return NextResponse.next();
  }

  // Check auth cookie
  const authCookie = request.cookies.get(AUTH_COOKIE_NAME);
  if (!authCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Verify the cookie value matches expected hash
  const expectedHash = simpleHash(password);
  if (authCookie.value !== expectedHash) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `ob_${Math.abs(hash).toString(36)}`;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     */
    "/((?!_next/static|_next/image).*)",
  ],
};
