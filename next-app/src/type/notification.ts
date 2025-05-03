import { NotificationType } from "@prisma/client";

export type Notification = {
  id: string;
  isRead: boolean;
  notification: {
    id: string;
    type: NotificationType;
    message: string;
    createdAt: Date;
    lessonId: string | null;
    exerciseId: string | null;
    completionId: string | null;
    createdByTeacherId: string | null;
    createdByStudentId: string | null;
  };
};
