export type AttendanceStatus = "PRESENT" | "ABSENT";

export interface AttendanceReport {
  student?: {
    id: string;
    name: string;
  };
  summary: {
    present: number;
    absent: number;
    total: number;
    percentage: number;
  };
  monthly: Record<string, { present: number; total: number }>;
  daily: {
    date: string;
    status: AttendanceStatus;
  }[];
}
