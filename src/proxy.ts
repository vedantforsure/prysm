import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const AUTH_COOKIE = "imgdb_auth";

// SHA-256 hex digest, available in the Edge runtime via Web Crypto.
async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function proxy(request: NextRequest) {
  const password = process.env.SITE_PASSWORD;

  // No password configured → gate is off (e.g. local dev). Let everything through.
  if (!password) return NextResponse.next();

  const token = request.cookies.get(AUTH_COOKIE)?.value;
  const expected = await sha256(password);

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
