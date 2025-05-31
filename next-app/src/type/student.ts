import { UserRole } from "@prisma/client";

export type Student = {
  id: string;
  name: string;
  identifier: string;
  isActive: boolean;
  // createdAt: Date;
  // groupStudent: Group;
};

export type StudentInfos = {
  id: string;
  name: string;
  identifier: string;
  password: string;
  image: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  professorId: string;
  groupId: string | null;
};

export type StudentInfosTeacher = {
  id: string;
  name: string;
  identifier: string;
  image: string | null;
  professorId: string;
  isActive: boolean;
  createdAt: Date;
  groupStudent: {
    id: string;
    name: string;
  } | null;
};
