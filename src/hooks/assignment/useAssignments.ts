import { useEffect, useState } from "react";

export function useAssignments(url: string) {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(url, { credentials: "include" })
      .then(res => res.json())
      .then(data => setAssignments(data.assignments || []))
      .finally(() => setLoading(false));
  }, [url]);

  return { assignments, loading };
}
