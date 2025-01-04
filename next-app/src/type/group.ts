export type Group = {
  id: string;
  name: string;
  authorId: string;
  createdAt: Date;
  users: {
    id: string;
    name: string;
  }[];
};
