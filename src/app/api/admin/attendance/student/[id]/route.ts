import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Attendance from "@/models/Attendance";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  // 🔥 REQUIRED IN NEW NEXT
  const { id: studentId } = await context.params;

  const records = await Attendance.find({
    "records.student": studentId,
  })
    .sort({ date: 1 })
    .lean();

  let present = 0;
  let absent = 0;

  const logs: any[] = [];
  const monthlyMap: Record<
    string,
    { present: number; total: number }
  > = {};

  for (const a of records) {
    const r = a.records.find(
      (x: any) => String(x.student) === studentId
    );
    if (!r) continue;

    const status = r.status;
    const date = a.date;

    logs.push({ date, status });

    if (status === "PRESENT") present++;
    else absent++;

    const monthKey = date.slice(0, 7); // YYYY-MM

    if (!monthlyMap[monthKey]) {
      monthlyMap[monthKey] = { present: 0, total: 0 };
    }

    monthlyMap[monthKey].total++;
    if (status === "PRESENT") {
      monthlyMap[monthKey].present++;
    }
  }

  const monthly = Object.entries(monthlyMap).map(
    ([month, v]) => ({
      month,
      present: v.present,
      total: v.total,
    })
  );

  const total = present + absent;
  const percentage = total
    ? Math.round((present / total) * 100)
    : 0;

  return NextResponse.json({
    present,
    absent,
    total,
    percentage,
    monthly,
    logs,
  });
}
