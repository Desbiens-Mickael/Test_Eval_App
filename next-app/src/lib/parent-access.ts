import "server-only";

import {
  ParentEmailError,
  setStudentParentEmailData,
} from "@/data/parent-data";
import { sendParentAccessEmail, sendParentChildAddedEmail } from "@/lib/mail";

/**
 * Applique l'e-mail du parent d'un élève et envoie automatiquement l'e-mail
 * qui va avec (accès d'un nouveau compte, ou enfant ajouté).
 * Renvoie le message à montrer au professeur, ou une erreur.
 */
export const applyStudentParentEmail = async ({
  studentId,
  studentName,
  email,
  teacherEmail,
}: {
  studentId: string;
  studentName: string;
  email: string | null;
  teacherEmail: string | null;
}): Promise<{ message: string } | { error: string }> => {
  let result;
  try {
    result = await setStudentParentEmailData({ studentId, email, teacherEmail });
  } catch (error) {
    if (error instanceof ParentEmailError) return { error: error.message };
    throw error;
  }

  switch (result.status) {
    case "unchanged":
      return { message: "Aucune modification." };
    case "removed":
      return { message: "L'accès parent a été retiré." };
    case "created":
      try {
        await sendParentAccessEmail(result.email, studentName, result.password);
        return { message: `Espace parent créé : les accès ont été envoyés à ${result.email}.` };
      } catch (error) {
        console.error("Envoi des accès parent :", error);
        return {
          message: `Espace parent créé, mais l'e-mail n'a pas pu être envoyé à ${result.email}. Le parent peut se connecter avec « Mot de passe oublié ».`,
        };
      }
    case "linked":
      try {
        await sendParentChildAddedEmail(result.email, studentName);
      } catch (error) {
        console.error("Envoi de l'e-mail au parent :", error);
      }
      return {
        message: `${result.email} a déjà un espace parent : ${studentName} y a été ajouté.`,
      };
  }
};
