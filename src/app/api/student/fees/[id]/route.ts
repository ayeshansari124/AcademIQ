import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getFeeProfile } from "@/controllers/fees.controller";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();

  const { id: studentId } = await params;
  if (!studentId) {
    return NextResponse.json({ error: "Student ID required" }, { status: 400 });
  }

  const data = await getFeeProfile(studentId);
  return NextResponse.json(data);
}
