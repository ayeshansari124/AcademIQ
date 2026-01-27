export interface Student {
  _id: string;
  fullName: string;
  parentName: string;
  phone: string;
  subjects: string[];
  days: string[];
  monthlyFee: number;
  createdAt: string;

  class?: {
    _id: string;
    name: string;
  };

  userId?: {
    _id: string;
    username: string;
    role: "STUDENT";
  };
}

export interface StudentCreationResult {
  student: Student;
  credentials: {
    username: string;
    password: string;
  };
}
