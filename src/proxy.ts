import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const AUTH_COOKIE = "imgdb_auth";

// Login is always required. If SITE_PASSWORD isn't set in the environment,
// this fallback is used so the gate still works (change it / set the env var).
export const SITE_PASSWORD = process.env.SITE_PASSWORD || "prompt-library";

// SHA-256 hex digest, available in the Edge runtime via Web Crypto.
async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  const expected = await sha256(SITE_PASSWORD);

  if (token && token === expected) return NextResponse.next();

  // Not authenticated → send to the login page, remembering where they wanted to go.
  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("from", request.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export const config = {
  // Run on every path except the login page, the login API, and static assets.
  matcher: ["/((?!login|api/login|_next/static|_next/image|favicon.ico|.*\\.[\\w]+$).*)"],
};
