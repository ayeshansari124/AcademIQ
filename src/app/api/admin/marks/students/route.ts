import { requireAdmin } from "@/guards/requireAdmin";
import { listStudentsController } from "@/controllers/marks.controller";
import { NextResponse } from "next/server";

export async function GET() {
  await requireAdmin();

  const students = await listStudentsController();

  return NextResponse.json({ students });
}
