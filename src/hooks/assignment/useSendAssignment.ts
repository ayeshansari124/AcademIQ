"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { AssignmentCreatePayload } from "@/types/assignment";

export function useSendAssignment(onSuccess: () => void) {
  const [loading, setLoading] = useState(false);

  async function submit(payload: AssignmentCreatePayload) {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/assignments", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      toast.success("Assignment sent successfully");
      onSuccess();
    } catch {
      toast.error("Failed to send assignment");
    } finally {
      setLoading(false);
    }
  }

  return { submit, loading };
}
