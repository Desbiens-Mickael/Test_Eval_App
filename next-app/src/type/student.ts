import { Group } from "./group";

export type Student = {
  id: string;
  name: string;
  identifier: string;
  isActive: boolean;
  createdAt: Date;
  groupStudent: Group;
};
