import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { registerPush } from "@/lib/push-client";

export function useAuthLogin({
  expectedRole,
  redirectTo,
  loadingText,
}: {
  expectedRole: "ADMIN" | "STUDENT";
  redirectTo: string;
  loadingText: string;
}) {
  const router = useRouter();

  return async (values: Record<string, string>) => {
    const t = toast.loading(loadingText);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // ✅ THIS WAS MISSING
      body: JSON.stringify(values),
    });

    const data = await res.json();
    toast.dismiss(t);

    if (!res.ok) {
      toast.error(data.error || "Login failed");
      return;
    }

    if (data.user.role !== expectedRole) {
      toast.error("Unauthorized role");
      return;
    }

    toast.success("Welcome back");
    await registerPush();

    router.replace(redirectTo); // replace > push
  };
}
