"use client";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { registerPush } from "@/lib/push-client";

export function useAdminRegister() {
  const router = useRouter();

  return async (form: Record<string, string>) => {
    if (!form.name || !form.email || !form.password || !form.secretKey) {
      return toast.error("All fields are required");
    }

    const toastId = toast.loading("Registering institute...");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();
      toast.dismiss(toastId);

      if (!res.ok) return toast.error(data.error);

      toast.success("Admin account created");
      await registerPush();
      router.push("/admin/dashboard");
    } catch {
      toast.dismiss(toastId);
      toast.error("Registration failed");
    }
  };
}
