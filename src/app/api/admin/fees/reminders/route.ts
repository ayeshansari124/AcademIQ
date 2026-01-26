import { NextResponse } from "next/server";
import { feeReminder } from "@/services/fees.service";

export async function POST() {
  try {
    const result = await feeReminder();
    return NextResponse.json({
      success: true,
      result,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to run fee reminder" },
      { status: 500 }
    );
  }
}
