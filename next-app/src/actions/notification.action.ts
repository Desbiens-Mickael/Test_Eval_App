"use server";

import { createNotificationLessonData } from "@/data/notification/notification.data";
import { NotificationType } from "@prisma/client";
import { currentUser } from "@/lib/auth";

export const createNotificationLesson = async (lessonId: string) => {
  const user = await currentUser();
  if (!user || !user.id) {
    throw new Error("Utilisateur non connecté");
  }
  // const notification = await createNotificationLessonData({
  //   type: NotificationType.LESSON,
  //   message: "Une nouvelle leçon a été ajoutée",
  //   lessonId,
  //   createdByTeacherId: user.id,
  // });
  // return notification;
};
