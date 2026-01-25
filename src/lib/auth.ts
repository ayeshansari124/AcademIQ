import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET!;

export type Role = "ADMIN" | "STUDENT";

export interface TokenPayload {
  userId: string;
  role: Role;
}

export function signToken(payload: TokenPayload) {
  return jwt.sign(payload, JWT_SECRET);
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}

export async function getStudentId(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("UNAUTHORIZED");
  }

  const payload = jwt.verify(
    token,
    process.env.JWT_SECRET!
  ) as TokenPayload;

  if (payload.role !== "STUDENT") {
    throw new Error("FORBIDDEN");
  }

  return payload.userId;
}