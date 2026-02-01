import bcrypt from "bcryptjs";
import User from "@/models/User";
import { signAuthToken } from "@/lib/auth";

export async function registerAdmin(data: {
  name: string;
  email: string;
  password: string;
  secretKey: string;
}) {
  if (data.secretKey !== process.env.ADMIN_SECRET_KEY) {
    throw new Error("INVALID_ADMIN_SECRET");
  }

  const email = data.email.trim().toLowerCase();

  const exists = await User.findOne({ email });
  if (exists) throw new Error("ADMIN_EXISTS");

  const passwordHash = await bcrypt.hash(data.password, 10);

  const user = await User.create({
    name: data.name.trim(),
    email,
    passwordHash,
    role: "ADMIN",
  });

  const token = signAuthToken({
    userId: user._id.toString(),
    role: "ADMIN",
  });

  return { user, token };
}

export async function loginUser(data: {
  identifier: string;
  password: string;
}) {
  const identifier = data.identifier.trim().toLowerCase();

  const user = await User.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  });

  if (!user) throw new Error("INVALID_CREDENTIALS");

  const ok = await bcrypt.compare(data.password, user.passwordHash);
  if (!ok) throw new Error("INVALID_CREDENTIALS");

  const token = signAuthToken({
    userId: user._id.toString(),
    role: user.role,
  });

  return { user, token };
}
