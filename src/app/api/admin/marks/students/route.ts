import  connectDB  from "@/lib/db";
import Student from "@/models/Student";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const students = await Student.find().select("_id fullName");
  return NextResponse.json(students);
}
