import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Auth disabled for now — will re-enable with Supabase Auth later
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
