import { NextResponse } from "next/server";

const AUTH_COOKIE_NAME = "open-brain-auth";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `ob_${Math.abs(hash).toString(36)}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    const expectedPassword = process.env.DASHBOARD_PASSWORD;

    if (!expectedPassword) {
      // No password configured, allow access
      const response = NextResponse.json({ success: true });
      response.cookies.set(AUTH_COOKIE_NAME, "no-auth", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: COOKIE_MAX_AGE,
        path: "/",
      });
      return response;
    }

    if (password !== expectedPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const hashValue = simpleHash(expectedPassword);
    const response = NextResponse.json({ success: true });
    response.cookies.set(AUTH_COOKIE_NAME, hashValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
