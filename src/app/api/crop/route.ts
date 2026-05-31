import { writeFileSync } from "fs";
import { join } from "path";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { position } = await req.json();
  writeFileSync(join(process.cwd(), "crop-pending.json"), JSON.stringify({ position }));
  return NextResponse.json({ ok: true });
}
