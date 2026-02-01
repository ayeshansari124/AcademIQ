import { requireAdmin } from "@/guards/requireAdmin";
import {
  handleGetClasses,
  handleCreateClass,
} from "@/controllers/class.controller";

export async function GET() {
  await requireAdmin();
  const classes = await handleGetClasses();
  return Response.json({ classes });
}

export async function POST(req: Request) {
  await requireAdmin();
  const { name, subjects } = await req.json();
  const cls = await handleCreateClass(name, subjects);
  return Response.json({ class: cls });
}
