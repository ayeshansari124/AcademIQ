import { loginUser, registerAdmin } from "@/services/auth.service";

export async function loginController(body: {
  identifier: string;
  password: string;
}) {
  const { user, token } = await loginUser(body);
  return { user, token };
}

export async function registerController(body: {
  name: string;
  email: string;
  password: string;
  secretKey: string;
}) {
  const { user, token } = await registerAdmin(body);
  return { user, token };
}
