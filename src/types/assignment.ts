export type AssignmentScope = "CLASS" | "STUDENT";

export interface AssignmentType {
  content: string;
  createdBy: {
    _id: string;
    name: string;
  };
  scope: AssignmentScope;
  classId?: string;
  studentIds?: string[];
  students: string;
}
