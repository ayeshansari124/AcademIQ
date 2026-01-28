export type Mark = {
  _id: string;
  examName: string;
  subject: string;
  marksObtained: number;
  totalMarks: number;
  percentage: number;
  academicYear: string;
  createdAt: string;
};

export type StudentBasic = {
  _id: string;
  fullName: string;
  subjects?: string[];
};

export type StudentMarksResponse = {
  student: StudentBasic | null;
  marks: Mark[];
};

export type CreateMarkDTO = {
  studentId: string;
  examName: string;
  subject: string;
  marksObtained: number;
  totalMarks: number;
  academicYear: string;
};
