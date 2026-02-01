import { requireAdmin } from "@/guards/requireAdmin";
import { markFeePaidCash } from "@/services/fees.service";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await requireAdmin();
  const { feeRecordId } = await req.json();

  if (!feeRecordId) {
    return NextResponse.json(
      { error: "feeRecordId required" },
      { status: 400 }
    );
  }

  await markFeePaidCash(feeRecordId);
  return NextResponse.json({ success: true });
}
