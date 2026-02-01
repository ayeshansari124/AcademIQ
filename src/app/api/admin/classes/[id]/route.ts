import { requireAdmin } from "@/guards/requireAdmin";
import {
  handleGetClass,
  handleDeleteClass,
} from "@/controllers/class.controller";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAdmin();
  const { id } = await params;
  const cls = await handleGetClass(id);
  return Response.json({ class: cls });
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAdmin();
  const { id } = await params;
  await handleDeleteClass(id);
  return Response.json({ message: "Class deleted" });
}
