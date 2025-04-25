import { prisma } from "@/lib/db";
import { NotificationType } from "@prisma/client";

interface CreateNotificationInput {
  lessonId: string;
  createdByTeacherId: string;
}

// Création d'une notification pour une leçon
export const createNotificationLessonData = async (
  data: CreateNotificationInput
) => {
  return await prisma.notification.create({
    data: {
      type: NotificationType.LESSON,
      message: "Une nouvelle leçon a été ajoutée",
      lessonId: data.lessonId,
      createdByTeacherId: data.createdByTeacherId,
    },
  });
};

// Création des StudentNotification
export const createStudentNotificationData = async (
  notificationId: string,
  studentsIds: { id: string }[]
) => {
  await prisma.studentNotification.createMany({
    data: studentsIds.map((student) => ({
      studentId: student.id,
      notificationId,
    })),
    skipDuplicates: true, // pour éviter les doublons si tu rejoues le script
  });
};
