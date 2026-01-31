"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { registerPush } from "@/lib/push-client";

export function useAuthLogin() {
  const router = useRouter();

  return async (values: Record<string, string>) => {
    const t = toast.loading("Signing in...");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(values),
    });

    const data = await res.json();
    toast.dismiss(t);

    if (!res.ok) {
      toast.error(data.error || "Login failed");
      return;
    }

    toast.success("Welcome back");
    await registerPush();

    router.replace(
      data.user.role === "ADMIN"
        ? "/admin/dashboard"
        : "/student/dashboard"
    );
  };
}
