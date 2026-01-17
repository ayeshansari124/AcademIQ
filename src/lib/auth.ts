import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export type Role = "ADMIN" | "STUDENT";

export interface TokenPayload {
  userId: string;
  role: Role;
}

export function signToken(payload: TokenPayload) {
  // persistent session (until logout)
  return jwt.sign(payload, JWT_SECRET);
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}
