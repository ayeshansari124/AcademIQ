import { handleGetClasses, handleCreateClass } from "@/controllers/class.controller";

export async function GET() {
  const classes = await handleGetClasses();
  return Response.json({ classes });
}

export async function POST(req: Request) {
  try {
    const { name, subjects } = await req.json();
    const cls = await handleCreateClass(name, subjects);
    return Response.json({ class: cls });
  } catch (e: any) {
    return Response.json(
      { error: e.message },
      { status: 400 }
    );
  }
}
