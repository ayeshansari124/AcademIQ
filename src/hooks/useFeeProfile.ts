"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FeeProfileResponse } from "@/types/fee";

export function useFeeProfile(studentId: string) {
  const [data, setData] = useState<FeeProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/student/fees/${studentId}`)
      .then(res => res.json())
      .then(res => {
        if (res.error) throw new Error(res.error);
        setData(res);
      })
      .catch(e => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [studentId]);

  return { data, loading };
}
