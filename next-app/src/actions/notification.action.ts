"use server";

import {
  getStudentNotificationsData,
  getTeacherNotificationsData,
  updateAllStudentNotificationData,
} from "@/data/notification/notification.data";
import { currentUser } from "@/lib/auth";
import { Notification } from "@/type/notification";

// Récupération de toutes les notifications d'un utilisateur en fonction de son rôle
export const getNotifications = async () => {
  const user = await currentUser();
  if (!user || !user.id) {
    return { error: "Action non autoriser !" };
  }

  try {
    let notifications: Notification[] = [];
    if (user.role === "STUDENT") {
      notifications = await getStudentNotificationsData(user.id);
    } else if (user.role === "ADMIN") {
      notifications = await getTeacherNotificationsData(user.id);
    }
    return { success: "Notifications récupérées.", data: notifications };
  } catch (error) {
    console.error(error);
    return {
      error:
        "Une erreur est survenue lors de la récupération des notifications.",
    };
  }
};

// Met à jour la ou les notifications comme étant lu en fonction du rôle de l'utilisateur
export const updateNotifications = async (notificationIds: string[]) => {
  const user = await currentUser();
  if (!user || !user.id) {
    return { error: "Action non autoriser !" };
  }

  if (!notificationIds || notificationIds.length === 0) {
    return { error: "Aucune notification sélectionnée." };
  }

  try {
    if (user.role === "STUDENT") {
      await updateAllStudentNotificationData(notificationIds);
    } else if (user.role === "ADMIN") {
      await updateAllStudentNotificationData(notificationIds);
    }
    return { success: "Notifications marquées comme lues." };
  } catch (error) {
    console.error(error);
    return {
      error:
        "Une erreur est survenue lors de la mise à jour des notifications.",
    };
  }
};
