import connectDB from "@/lib/db";
import { AttendanceController } from "@/controllers/attendance.controller";
import { requireStudent } from "@/guards/requireStudent";

export async function GET() {
  await connectDB();

  const { userId } = await requireStudent();

  const report =
    await AttendanceController.getStudentReportByUserId(userId);

  return Response.json(report);
}
