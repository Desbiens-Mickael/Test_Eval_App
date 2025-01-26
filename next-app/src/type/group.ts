export type Student = {
  id: string;
  firstName: string;
  lastName: string;
  identifier: string;
  isActive: boolean;
};

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
