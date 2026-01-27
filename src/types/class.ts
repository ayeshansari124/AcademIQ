import { Student } from "@/types/student";

export interface Class {
  _id: string;
  name: string;
  subjects: string[];
  students?: Student[];
}
