"use client";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { registerPush } from "@/lib/push-client";

interface AdminRegisterPayload {
  name: string;
  email: string;
  password: string;
  secretKey: string;
}

export function useAdminRegister() {
  const router = useRouter();

  return async (form: AdminRegisterPayload) => {
    if (!form.name || !form.email || !form.password || !form.secretKey) {
      toast.error("All fields are required");
      return;
    }

    const toastId = toast.loading("Creating admin account...");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();
      toast.dismiss(toastId);

      if (!res.ok) {
        toast.error(data.error ?? "Registration failed");
        return;
      }

      toast.success("Admin account created");
      registerPush().catch(() => {        console.warn("Push registration skipped");
      });

      router.replace("/admin/dashboard");
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Registration failed. Please try again.");
    }
  };
}
