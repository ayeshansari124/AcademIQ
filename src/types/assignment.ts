export type AssignmentScope = "CLASS" | "STUDENT";

export interface AssignmentCreatePayload {
  content: string;
  scope: AssignmentScope;
  classId?: string;
  studentIds?: string[];
}

export interface AssignmentCreator {
  _id: string;
  name: string;
}

export interface Assignment {
  _id: string;
  content: string;
  scope: AssignmentScope;
  createdAt: string;
  createdBy: AssignmentCreator;
}
