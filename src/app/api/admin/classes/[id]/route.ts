import { handleGetClass, handleDeleteClass } from "@/controllers/class.controller";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cls = await handleGetClass(id);
    return Response.json({ class: cls });
  } catch {
    return Response.json(
      { error: "Not found" },
      { status: 404 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await handleDeleteClass(id);
    return Response.json({ message: "Class deleted" });
  } catch (e: any) {
    return Response.json(
      { error: e.message },
      { status: 400 }
    );
  }
}
