import connectDB from "@/lib/db";
import Assignment from "@/models/Assignment";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import Student from "@/models/Student";

import Notification from "@/models/Notification";
import PushSubscription from "@/models/PushSubscription";
import { sendPush } from "@/lib/push-server";
import createUserNotification from "@/services/notification.service"


const JWT_SECRET = process.env.JWT_SECRET!;

// =======================
// GET: Admin assignments
// =======================
export async function GET() {
  await connectDB();

  const cookieStore= await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    return Response.json({ assignments: [] }, { status: 401 });
  }

  let payload: any;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch {
    return Response.json({ assignments: [] }, { status: 401 });
  }

  if (payload.role !== "ADMIN") {
    return Response.json({ assignments: [] }, { status: 403 });
  }

  const assignments = await Assignment.find()
    .sort({ createdAt: -1 });

  return Response.json({ assignments });
}

// =======================
// POST: Create assignment
// =======================
export async function POST(req: Request) {
  await connectDB();

  const cookieStore= await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: any;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (payload.role !== "ADMIN") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return Response.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { title, description, scope, studentIds = [], classId } = body;

  // 🔒 BASIC VALIDATION
  if (!title || !description || !scope) {
    return Response.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  if (scope === "CLASS" && !classId) {
    return Response.json(
      { error: "Class is required for class assignment" },
      { status: 400 }
    );
  }

  if (scope === "STUDENT" && studentIds.length === 0) {
    return Response.json(
      { error: "At least one student is required" },
      { status: 400 }
    );
  }

  // 🧱 SAFE DB WRITE
  try {
    const assignment = await Assignment.create({
      title,
      description,
      scope,
      studentIds: scope === "STUDENT" ? studentIds : [],
      classId: scope === "CLASS" ? classId : null,
      createdBy: payload.userId,
    });

// 🔔 FIND TARGET STUDENTS
let students: any[] = [];

if (scope === "CLASS") {
  students = await Student.find({ class: classId });
}

if (scope === "STUDENT") {
  students = await Student.find({ _id: { $in: studentIds } });
}

// 🔔 NOTIFY EACH STUDENT (DB + PUSH)
for (const student of students) {
  console.log("Notifying student:", student._id.toString());

  // ✅ DB notification
  await createUserNotification({
    userId: student.userId, // ✅ IMPORTANT
    type: "ASSIGNMENT",
    title: "New Assignment",
    message: title,
    metadata: { assignmentId: assignment._id },
  });

  // ✅ Push notification
  const sub = await PushSubscription.findOne({
    userId: student.userId,
  });

  if (sub) {
    await sendPush(sub.subscription, {
      title: "New Assignment",
      body: title,
      data: {
        url: "/student/assignments",
      },
    });
  }
}


    return Response.json({ success: true, assignment });

    

  } catch (err) {
    console.error("ASSIGNMENT CREATE ERROR:", err);
    return Response.json(
      { error: "Failed to create assignment" },
      { status: 500 }
    );
  }
}
