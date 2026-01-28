export type FeeStatus = "PENDING" | "PAID" | "OVERDUE" | "PARTIAL";

export interface FeeRecordDTO {
  _id: string;
  month: number;
  year: number;
  amountDue: number;
  amountPaid: number;
  status: FeeStatus;
  dueDate: string;
  paidAt?: string;
}

export interface FeeProfileResponse {
  student: {
    fullName: string;
    monthlyFee: number;
    class?: { name: string };
  };
  currentFee: FeeRecordDTO | null;
  feeHistory: FeeRecordDTO[];
}
