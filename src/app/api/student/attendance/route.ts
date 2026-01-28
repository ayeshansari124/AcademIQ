import connectDB from "@/lib/db";
import { AttendanceController } from "@/controllers/attendance.controller";
import { getStudentUserId } from "@/lib/auth";

export async function GET() {
  await connectDB();
  const userId = await getStudentUserId();

  const report =
    await AttendanceController.getStudentReportByUserId(userId);

  return Response.json(report);
}
