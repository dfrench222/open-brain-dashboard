import { cookies } from "next/headers";

const AUTH_COOKIE_NAME = "open-brain-auth";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function isAuthenticated(): Promise<boolean> {
  const password = process.env.DASHBOARD_PASSWORD;
  // If no password is set, allow access (dev mode)
  if (!password) return true;

  const cookieStore = await cookies();
  const authCookie = cookieStore.get(AUTH_COOKIE_NAME);
  if (!authCookie) return false;

  // Simple check: cookie value matches the hash we set
  return authCookie.value === hashPassword(password);
}

export function hashPassword(password: string): string {
  // Simple hash for cookie comparison
  // This is NOT cryptographic security -- it's a gate, not a vault
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `ob_${Math.abs(hash).toString(36)}`;
}

export function getAuthCookieName(): string {
  return AUTH_COOKIE_NAME;
}

export function getAuthCookieMaxAge(): number {
  return COOKIE_MAX_AGE;
}
