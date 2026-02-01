import { requireAdmin } from "@/guards/requireAdmin";
import { getStudentByStudentId } from "@/services/student.service";
import { deleteStudentById } from "@/controllers/student.controller";
import { NextResponse } from "next/server";

type Params = { id: string };

export async function GET(_: Request, context: { params: Promise<Params> }) {
  await requireAdmin();
  const { id } = await context.params;

  const student = await getStudentByStudentId(id);
  return NextResponse.json({ student });
}

export async function DELETE(_: Request, context: { params: Promise<Params> }) {
  await requireAdmin();
  const { id } = await context.params;

  await deleteStudentById(id);
  return NextResponse.json({ message: "Student deleted" });
}
