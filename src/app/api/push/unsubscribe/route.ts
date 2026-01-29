import connectDB from "@/lib/db";
import { removeSubscription } from "@/services/push.service";

export async function POST(req: Request) {
  await connectDB();

  const { endpoint } = await req.json();
  if (!endpoint) {
    return Response.json({ error: "Missing endpoint" }, { status: 400 });
  }

  await removeSubscription(endpoint);
  return Response.json({ success: true });
}
