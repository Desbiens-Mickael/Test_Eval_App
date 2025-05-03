import { UserRole } from "@prisma/client";
import { Group } from "./group";

export type Student = {
  id: string;
  name: string;
  identifier: string;
  isActive: boolean;
  createdAt: Date;
  groupStudent: Group;
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

