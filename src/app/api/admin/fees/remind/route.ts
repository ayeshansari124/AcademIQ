import { requireAdmin } from "@/guards/requireAdmin";
import { runFeeReminder } from "@/services/fees.service";
import { NextResponse } from "next/server";

export async function POST() {
  await requireAdmin();
  const result = await runFeeReminder();
  return NextResponse.json({ success: true, result });
}
