"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FeeProfileResponse } from "@/types/fee";

export function useFeeProfile(studentId: string) {
  const [data, setData] = useState<FeeProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);
      const res = await fetch(`/api/student/fees/${studentId}`);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to load fees");
      }

      setData(json);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [studentId]);

  return { data, loading, reload: load };
}
