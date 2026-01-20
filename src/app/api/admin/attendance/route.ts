import connectDB from "@/lib/db";
import {
  markAttendance,
  getClassAttendance,
} from "@/services/attendance.service";

export async function POST(req: Request) {
  await connectDB();

  try {
    const body = await req.json();
    const attendance = await markAttendance(body);
    return Response.json({ attendance });
  } catch (e: any) {
    return Response.json(
      { error: e.message },
      { status: 400 }
    );
  }
}

export async function GET(req: Request) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const classId = searchParams.get("classId")!;
    const date = searchParams.get("date")!;

    const attendance = await getClassAttendance({
      classId,
      date,
    });

    return Response.json({ attendance });
  } catch (e: any) {
    return Response.json(
      { error: e.message },
      { status: 400 }
    );
  }
}
