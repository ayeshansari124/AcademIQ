import connectDB from "@/lib/db";
import { listStudentsController } from "@/controllers/marks.controller";

export async function GET() {
  await connectDB();
  return listStudentsController();
}
