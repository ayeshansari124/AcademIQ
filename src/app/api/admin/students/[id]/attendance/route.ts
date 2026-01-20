import connectDB from "@/lib/db";
import Attendance from "@/models/Attendance";
import Student from "@/models/Student";
import "@/models/Class";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await context.params;

  const student = await Student.findById(id);
  if (!student) {
    return Response.json(
      { error: "Student not found" },
      { status: 404 }
    );
  }

  const records = await Attendance.find({
    "records.student": student._id,
  });

  let present = 0;
  let absent = 0;

  const monthly: Record<
    string,
    { present: number; total: number }
  > = {};

  records.forEach((att) => {
    const record = att.records.find(
      (r: any) =>
        r.student.toString() === student._id.toString()
    );

    if (!record) return;

    const month = att.date.slice(0, 7); // YYYY-MM

    if (!monthly[month]) {
      monthly[month] = { present: 0, total: 0 };
    }

    monthly[month].total += 1;

    if (record.status === "PRESENT") {
      present += 1;
      monthly[month].present += 1;
    } else {
      absent += 1;
    }
  });

  const total = present + absent;
  const percentage =
    total === 0 ? 0 : Math.round((present / total) * 100);

  return Response.json({
    summary: {
      present,
      absent,
      total,
      percentage,
    },
    monthly,
  });
}
