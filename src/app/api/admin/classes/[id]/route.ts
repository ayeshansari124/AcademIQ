import connectDB from "@/lib/db";
import ClassModel from "@/models/Class";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();
    const { id } = await context.params;
  const cls = await ClassModel.findById(id).populate(
    "students",
    "fullName"
  );

  if (!cls) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json({ class: cls });
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();
const { id } = await context.params;
  const cls = await ClassModel.findById(id);

  if (!cls) {
    return Response.json({ error: "Class not found" }, { status: 404 });
  }

  if (cls.students.length > 0) {
    return Response.json(
      { error: "Cannot delete class with enrolled students" },
      { status: 400 }
    );
  }

  await ClassModel.findByIdAndDelete(id);

  return Response.json({ message: "Class deleted" });
}