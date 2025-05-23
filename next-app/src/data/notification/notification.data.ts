import { prisma } from "@/lib/db";
import { NotificationType } from "@prisma/client";

interface CreateNotificationInput {
  lessonId?: string;
  exerciseId?: string;
  completionId?: string;
  createdByTeacherId?: string;
  createdByStudentId?: string;
  message: string;
}

// Création d'une notification pour une leçon
export const createNotificationLessonData = async (
  data: CreateNotificationInput
) => {
  return await prisma.notification.create({
    data: {
      type: NotificationType.LESSON,
      message: data.message,
      lessonId: data.lessonId,
      createdByTeacherId: data.createdByTeacherId,
    },
  });
};

// Création d'une notification pour un exercice
export const createNotificationExerciseData = async (
  data: CreateNotificationInput
) => {
  return await prisma.notification.create({
    data: {
      type: NotificationType.EXERCISE,
      message: data.message,
      exerciseId: data.exerciseId,
      createdByTeacherId: data.createdByTeacherId,
    },
  });
};

// Création d'une notification pour une completion
export const createNotificationCompletionData = async (
  data: CreateNotificationInput
) => {
  return await prisma.notification.create({
    data: {
      type: NotificationType.COMPLETION,
      message: data.message,
      completionId: data.completionId,
      createdByStudentId: data.createdByStudentId,
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

// Création des TeacherNotification
export const createTeacherNotificationData = async (
  notificationId: string,
  teacherId: string
) => {
  await prisma.teacherNotification.create({
    data: {
      teacherId,
      notificationId,
    },
  });
};

// Récupération de toutes les notifications d'un élève
export const getStudentNotificationsData = async (studentId: string) => {
  return await prisma.studentNotification.findMany({
    where: {
      studentId,
      isRead: false,
    },
    include: {
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
      isRead: false,
    },
    include: {
      notification: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// Met à jour la notification d'un élève comme étant lu
export const updateStudentNotificationData = async (
  studentNotificationId: string
) => {
  return await prisma.studentNotification.update({
    where: { id: studentNotificationId },
    data: { isRead: true },
  });
};

// Met à jour toutes les notifications données d'un élève comme étant lu
export const updateAllStudentNotificationData = async (
  studentNotificationIds: string[]
) => {
  return await prisma.studentNotification.updateMany({
    where: { id: { in: studentNotificationIds } },
    data: { isRead: true },
  });
};

// Met à jour la notification d'un professeur comme étant lu
export const updateTeacherNotificationData = async (
  teacherNotificationId: string
) => {
  return await prisma.teacherNotification.update({
    where: { id: teacherNotificationId },
    data: { isRead: true },
  });
};

// Met à jour toutes les notifications données d'un professeur comme étant lu
export const updateAllTeacherNotificationData = async (
  teacherNotificationIds: string[]
) => {
  return await prisma.teacherNotification.updateMany({
    where: { id: { in: teacherNotificationIds } },
    data: { isRead: true },
  });
};
