"use client";

import { useCallback, useEffect, useState } from "react";
import { Assignment } from "@/types/assignment";

interface UseAssignmentsResult {
  assignments: Assignment[];
  loading: boolean;
  refetch: () => Promise<void>;
}

export function useAssignments(apiUrl: string): UseAssignmentsResult {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAssignments = useCallback(async () => {
    setLoading(true);
    const res = await fetch(apiUrl, { credentials: "include" });
    const data = await res.json();
    setAssignments(data.assignments ?? []);
    setLoading(false);
  }, [apiUrl]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  return { assignments, loading, refetch: fetchAssignments };
}
