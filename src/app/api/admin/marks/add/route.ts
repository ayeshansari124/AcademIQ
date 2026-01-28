import connectDB from "@/lib/db";
import { createMarkController } from "@/controllers/marks.controller";

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  return createMarkController(body);
}
