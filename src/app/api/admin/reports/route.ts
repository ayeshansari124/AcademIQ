import { NextResponse } from "next/server";
import { requireAdmin } from "@/guards/requireAdmin";

export async function GET() {
  await requireAdmin();

  return NextResponse.json({});
}