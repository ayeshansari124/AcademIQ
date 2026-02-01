export type FeeStatus = "PENDING" | "PAID" | "OVERDUE" | "PARTIAL";

export interface FeeRecordDTO {
  _id: string;
  month: number;
  year: number;
  amount: number;
  amountPaid: number;
  status: FeeStatus;
  dueDate: string;
  paidAt?: string;
}

export interface FeeHistoryRow {
  _id: string;
  date: string;
  amount: number;
  status: FeeStatus;
  mode: "ONLINE" | "CASH" | "-";
}

export interface FeeProfileResponse {
  student: {
    fullName: string;
    monthlyFee: number;
    class?: { name: string };
  };
  currentFee: FeeRecordDTO | null;
  feeHistory: FeeHistoryRow[];
}
