import { NextResponse } from "next/server";
import { markFeePaidCash } from "@/services/fees.service";

export async function POST(req: Request) {
  try {
    const { feeRecordId } = await req.json();

    if (!feeRecordId) {
      return NextResponse.json(
        { error: "feeRecordId required" },
        { status: 400 }
      );
    }

    await markFeePaidCash(feeRecordId);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to mark paid" },
      { status: 500 }
    );
  }
}
