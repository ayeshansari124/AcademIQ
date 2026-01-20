import connectDB from "@/lib/db";
import ClassModel from "@/models/Class";
import "@/models/Student";

export async function GET() {
  await connectDB();

  const classes = await ClassModel.find()
    .populate("students", "fullName days");

  return Response.json({ classes });
}

export async function POST(req: Request) {
  await connectDB();
  const { name, subjects } = await req.json();

  if (!name || !subjects?.length) {
    return Response.json({ error: "Invalid data" }, { status: 400 });
  }

  const cls = await ClassModel.create({ name, subjects });
  return Response.json({ class: cls });
}
