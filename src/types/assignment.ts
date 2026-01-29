export type AssignmentScope = "CLASS" | "STUDENT";

export interface CreateAssignmentDTO {
  title: string;
  description: string;
  scope: AssignmentScope;
  classId?: string;
  studentIds?: string[];
  dueDate?: string;
}
