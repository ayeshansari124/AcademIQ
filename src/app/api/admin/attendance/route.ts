import connectDB from "@/lib/db";
import Attendance from "@/models/Attendance";
import ClassModel from "@/models/Class";
import "@/models/Student";

export async function POST(req: Request) {
  await connectDB();

  const { classId, date, records } = await req.json();

  if (!classId || !date || !records?.length) {
    return Response.json({ error: "Invalid data" }, { status: 400 });
  }

  const cls = await ClassModel.findById(classId);
  if (!cls) {
    return Response.json({ error: "Class not found" }, { status: 404 });
  }

  // ❌ Sunday lock
  if (new Date(date).getDay() === 0) {
    return Response.json(
      { error: "Attendance not allowed on Sundays" },
      { status: 400 }
    );
  }

  // ❌ Past date lock
  const today = new Date().toISOString().split("T")[0];
  if (date < today) {
    return Response.json(
      { error: "Past attendance is locked" },
      { status: 400 }
    );
  }

  // ❌ No students lock
  if (records.length === 0) {
  return Response.json(
    { error: "No students available for attendance on this day" },
    { status: 400 }
  );
}


  const attendance = await Attendance.findOneAndUpdate(
    { class: classId, date },
    { class: classId, date, records },
    { upsert: true, new: true }
  );

  return Response.json({ attendance });
}

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const classId = searchParams.get("classId");
  const date = searchParams.get("date");

  if (!classId || !date) {
    return Response.json({ error: "Missing params" }, { status: 400 });
  }

  const attendance = await Attendance.findOne({
    class: classId,
    date,
  }).populate("records.student", "fullName");

  return Response.json({ attendance });
}
