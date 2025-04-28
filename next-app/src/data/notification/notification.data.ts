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

// Récupération de toutes les notifications d'un élève
export const getStudentNotificationsData = async (studentId: string) => {
  return await prisma.studentNotification.findMany({
    where: {
      studentId,
    },
    select: {
      id: true,
      isRead: true,
      notification: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// Récupération de toutes les notifications d'un professeur
export const getTeacherNotificationsData = async (teacherId: string) => {
  return await prisma.teacherNotification.findMany({
    where: {
      teacherId,
    },
    include: {
      notification: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
