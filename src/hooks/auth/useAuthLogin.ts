"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { registerPush } from "@/lib/push-client";

interface LoginPayload {
  identifier: string;
  password: string;
}

export function useAuthLogin() {
  const router = useRouter();

  return async (values: LoginPayload) => {
    if (!values.identifier || !values.password) {
      toast.error("All fields are required");
      return;
    }

    const toastId = toast.loading("Signing in...");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(values),
      });

      const data = await res.json();
      toast.dismiss(toastId);

      if (!res.ok) {
        toast.error(data.error ?? "Invalid credentials");
        return;
      }

      toast.success("Welcome back");
      await registerPush();

      router.replace(
        data.user.role === "ADMIN"
          ? "/admin/dashboard"
          : "/student/dashboard"
      );
    } catch {
      toast.dismiss(toastId);
      toast.error("Login failed. Please try again.");
    }
  };
}
