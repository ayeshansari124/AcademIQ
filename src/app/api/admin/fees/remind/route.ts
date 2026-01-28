import { NextResponse } from "next/server";
import { runFeeReminder } from "@/services/fees.service";

export async function POST() {
  try {
    const result = await runFeeReminder();
    return NextResponse.json({ success: true, result });
  } catch {
    return NextResponse.json(
      { error: "Failed to send reminders" },
      { status: 500 }
    );
  }
}
