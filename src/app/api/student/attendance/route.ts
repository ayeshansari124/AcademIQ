import { requireStudent } from "@/guards/requireStudent";
import { AttendanceController } from "@/controllers/attendance.controller";

export async function GET() {
  const { userId } = await requireStudent();

  const report =
    await AttendanceController.getStudentReportByUserId(userId);

  return Response.json(report);
}
