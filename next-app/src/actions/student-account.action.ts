"use server";

import {
  getStudentByIdData,
  setStudentDisabledData,
  updateStudentPasswordData,
} from "@/data/student-data";
import { currentUser } from "@/lib/auth";
import { hashPassword } from "@/lib/hash-password";
import { sendCredentialStudentEmail } from "@/lib/mail";
import { generateStudentPassword } from "@/lib/student-password";

/** Vérifie que l'utilisateur est le professeur de cet élève */
const getOwnedStudent = async (studentId: string) => {
  const user = await currentUser();
  if (!user?.id || user.role !== "ADMIN") return { error: "Action non autoriser !" } as const;

  const student = await getStudentByIdData(studentId);
  if (!student || student.professorId !== user.id) {
    return { error: "Cet élève n'existe pas !" } as const;
  }
  return { user, student } as const;
};

/**
 * Génère un nouveau mot de passe pour l'élève (il n'a pas d'email pour le
 * réinitialiser lui-même). Le mot de passe est affiché une seule fois au
 * professeur et lui est aussi envoyé par email.
 */
export const resetStudentPasswordAction = async (studentId: string) => {
  const owned = await getOwnedStudent(studentId);
  if ("error" in owned) return { error: owned.error };
  const { user, student } = owned;

  try {
    const password = generateStudentPassword();
    await updateStudentPasswordData(student.id, await hashPassword(password));

    // L'email est un plus : son échec n'annule pas la réinitialisation
    let emailSent = false;
    if (user.email) {
      try {
        const [firstname, ...rest] = student.name.split(" ");
        await sendCredentialStudentEmail(
          user.email,
          firstname,
          rest.join(" "),
          student.identifier,
          password
        );
        emailSent = true;
      } catch (error) {
        console.error("Error sending reset password email:", error);
      }
    }

    return {
      success: `Le mot de passe de ${student.name} a été réinitialisé.`,
      data: { name: student.name, identifier: student.identifier, password, emailSent },
    };
  } catch (error) {
    console.error("Error resetting student password:", error);
    return { error: "Une erreur est survenue lors de la réinitialisation." };
  }
};

/** Désactive ou réactive le compte d'un élève */
export const setStudentDisabledAction = async (
  studentId: string,
  disabled: boolean
) => {
  const owned = await getOwnedStudent(studentId);
  if ("error" in owned) return { error: owned.error };
  const { student } = owned;

  try {
    const updated = await setStudentDisabledData(
      student.id,
      disabled ? new Date() : null
    );
    return {
      success: disabled
        ? `Le compte de ${student.name} est désactivé : plus aucune connexion n'est possible.`
        : `Le compte de ${student.name} est réactivé.`,
      data: updated,
    };
  } catch (error) {
    console.error("Error updating student account status:", error);
    return { error: "Une erreur est survenue lors de la mise à jour du compte." };
  }
};
