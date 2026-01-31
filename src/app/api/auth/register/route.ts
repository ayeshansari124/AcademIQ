import connectDB from "@/lib/db";
import { registerController } from "@/controllers/auth.controller";

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  return registerController(body);
}
