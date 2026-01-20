import { NextResponse } from "next/server";
import { getStudentByUserId } from "@/services/student.service";
import connectDB from "@/lib/db";
import Student from "@/models/Student";
import ClassModel from "@/models/Class";
import User from "@/models/User";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const student = await getStudentByUserId(id);

    return NextResponse.json({ student });
  } catch (error: any) {
    if (error.message === "STUDENT_NOT_FOUND") {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch student" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await context.params;

  const student = await Student.findById(id)
  .populate("class", "name"); 


  if (!student) {
    return Response.json(
      { error: "Student not found" },
      { status: 404 }
    );
  }

  // 2️⃣ Remove student from class.students[]
  if (student.class) {
    await ClassModel.findByIdAndUpdate(
      student.class,
      { $pull: { students: student._id } }
    );
  }

  // 3️⃣ Delete linked user account
  await User.findByIdAndDelete(student.userId);

  // 4️⃣ Delete student
  await Student.findByIdAndDelete(id);

  return Response.json({ message: "Student deleted" });
}
