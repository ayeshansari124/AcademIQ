import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getFeeProfile } from "@/controllers/fees.controller";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    // ✅ MUST await params
    const { id: studentId } = await params;

    if (!studentId) {
      return NextResponse.json(
        { error: "Student ID required" },
        { status: 400 }
      );
    }

    const data = await getFeeProfile(studentId);
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch fees" },
      { status: 500 }
    );
  }
}
