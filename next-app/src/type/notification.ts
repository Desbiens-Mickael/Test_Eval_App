import { NotificationType } from "@prisma/client";

export type Notification = {
  id: string;
  isRead: boolean;
  /** Usage de l'exercice d'une notification EXERCISE (contrôle ou exercice non noté) */
  exerciseKind?: "CONTROL" | "PRACTICE" | null;
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
