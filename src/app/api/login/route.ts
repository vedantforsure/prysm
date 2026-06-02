import { NextResponse } from "next/server";
import { AUTH_COOKIE } from "@/proxy";

async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function POST(request: Request) {
  const password = process.env.SITE_PASSWORD;

  // If no password is configured the gate is off; nothing to authenticate against.
  if (!password) {
    return NextResponse.json({ ok: true });
  }

  let submitted = "";
  try {
    const body = await request.json();
    submitted = typeof body?.password === "string" ? body.password : "";
  } catch {
    submitted = "";
  }

  if (submitted !== password) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(AUTH_COOKIE, await sha256(password), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return response;
}
