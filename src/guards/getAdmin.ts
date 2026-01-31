
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET!;

export default async function getAdmin() {
  const token = (await cookies()).get("token")?.value;
  const payload = jwt.verify(token!, JWT_SECRET) as any;
  if (payload.role !== "ADMIN") throw new Error("FORBIDDEN");
  return payload;
}
