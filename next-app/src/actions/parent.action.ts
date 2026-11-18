"use server";

import { getStudentProgressRawData } from "@/data/dashboard/student-progress.data";
import { closeExpiredControlsSafeData } from "@/data/exercice/control-closure.data";
import {
  getChildrenOfParentData,
  getParentSettingsData,
  isParentOfStudentData,
  setParentNotificationsData,
} from "@/data/parent-data";
import { UpdateUserData, getUserByIdData } from "@/data/user-data";
import { currentUser } from "@/lib/auth";
import { hashPassword, verifyPassword } from "@/lib/hash-password";
import { buildStudentProgress } from "@/lib/student-progress";
import { ParentPasswordFormType, parentPasswordFormSchema } from "@/shema-zod/parent.shema";

/** Parent connecté, ou null */
const currentParent = async () => {
  const user = await currentUser();
  return user?.id && user.role === "PARENT" ? { id: user.id } : null;
};

/** Enfants suivis par le parent connecté */
export const getMyChildrenAction = async () => {
  const parent = await currentParent();
  if (!parent) return { error: "Action non autoriser !" as const };
  try {
    return { success: true as const, data: await getChildrenOfParentData(parent.id) };
  } catch (error) {
    console.error("Error fetching parent children:", error);
    return { error: "Une erreur est survenue lors de la recherche de vos enfants." as const };
  }
};

/** Progression d'un enfant, comme sur le tableau de bord de l'élève */
export const getChildProgressAction = async (studentId: string) => {
  const parent = await currentParent();
  if (!parent || !(await isParentOfStudentData(parent.id, studentId))) {
    return { error: "Action non autoriser !" as const };
  }
  try {
    await closeExpiredControlsSafeData();
    const raw = await getStudentProgressRawData(studentId);
    if (!raw) return { error: "Élève introuvable." as const };
    return {
      success: true as const,
      data: { studentName: raw.studentName, progress: buildStudentProgress(raw) },
    };
  } catch (error) {
    console.error("Error building child progress:", error);
    return { error: "Une erreur est survenue lors du calcul de la progression." as const };
  }
};

/** Paramètres du parent connecté */
export const getParentSettingsAction = async () => {
  const parent = await currentParent();
  if (!parent) return { error: "Action non autoriser !" as const };
  const settings = await getParentSettingsData(parent.id);
  if (!settings) return { error: "Compte introuvable." as const };
  return { success: true as const, data: settings };
};

/** Active ou coupe les e-mails envoyés à chaque nouvelle note */
export const setParentNotificationsAction = async (enabled: boolean) => {
  const parent = await currentParent();
  if (!parent || typeof enabled !== "boolean") return { error: "Action non autoriser !" };
  await setParentNotificationsData(parent.id, enabled);
  return {
    success: enabled
      ? "Vous recevrez un e-mail à chaque nouvelle note."
      : "Vous ne recevrez plus d'e-mail à chaque nouvelle note.",
  };
};

/** Le parent remplace son mot de passe (provisoire au départ) */
export const changeParentPasswordAction = async (values: ParentPasswordFormType) => {
  const parent = await currentParent();
  if (!parent) return { error: "Action non autoriser !" };

  const parsed = parentPasswordFormSchema.safeParse(values);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Données non valide !" };

  const user = await getUserByIdData(parent.id);
  if (!user?.password || !(await verifyPassword(user.password, parsed.data.currentPassword))) {
    return { error: "Mot de passe actuel incorrect." };
  }

  await UpdateUserData(parent.id, { password: await hashPassword(parsed.data.newPassword) });
  return { success: "Votre mot de passe a été modifié." };
};
