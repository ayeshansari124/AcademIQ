"use client";

import { useEffect, useState } from "react";
import { Assignment } from "@/types/assignment";

interface UseAssignmentsResult {
  assignments: Assignment[];
  loading: boolean;
}

export function useAssignments(url: string): UseAssignmentsResult {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    fetch(url, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (mounted) {
          setAssignments(data.assignments ?? []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setAssignments([]);
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [url]);

  return { assignments, loading };
}
