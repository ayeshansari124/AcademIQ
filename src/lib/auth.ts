import jwt from "jsonwebtoken";

export type Role = "ADMIN" | "STUDENT";

export interface TokenPayload {
  userId: string;
  role: Role;
}

const JWT_SECRET = process.env.JWT_SECRET!;

export function signAuthToken(payload: TokenPayload) {
  return jwt.sign(payload, JWT_SECRET);
}

export function verifyAuthToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}
