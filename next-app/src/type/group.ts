import { Student } from "./student";

export type Group = {
  id: string;
  name: string;
  authorId: string;
  createdAt: Date;
  students: Student[];
};

export type searchUserFromGroup = {
  id: string;
  identifier?: string;
};
