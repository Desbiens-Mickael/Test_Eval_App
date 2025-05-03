import { Lesson } from "./lesson";
import { Student } from "./student";

export type Group = {
  id: string;
  name: string;
  authorId: string;
  createdAt: Date;
  students: Student[];
  lessons: Lesson[];
};

export type searchUserFromGroup = {
  id: string;
  identifier?: string;
};
