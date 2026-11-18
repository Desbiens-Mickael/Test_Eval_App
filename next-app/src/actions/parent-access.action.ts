"use server";

import { getStudentByIdData } from "@/data/student-data";
import { currentUser } from "@/lib/auth";
import { applyStudentParentEmail } from "@/lib/parent-access";
import { parentEmailShema } from "@/shema-zod/parent.shema";

/**
 * Le professeur renseigne, change ou efface l'e-mail du parent d'un élève.
 * Renseigné, l'accès parent est créé et envoyé automatiquement ;
 * effacé, il est retiré.
 */
export const setStudentParentEmailAction = async (studentId: string, parentEmail: unknown) => {
  const user = await currentUser();
  if (!user?.id || user.role !== "ADMIN") {
    return { error: "Action non autoriser !" };
  }

  const parsed = parentEmailShema.safeParse(parentEmail);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Adresse e-mail invalide" };
  }

  const student = await getStudentByIdData(studentId);
  if (!student || student.professorId !== user.id) {
    return { error: "Élève introuvable" };
  }

  try {
    const result = await applyStudentParentEmail({
      studentId,
      studentName: student.name,
      email: parsed.data,
      teacherEmail: user.email ?? null,
    });
    if ("error" in result) return { error: result.error };
    return { success: result.message, parentEmail: parsed.data };
  } catch (error) {
    console.error("Error setting parent email:", error);
    return { error: "Une erreur est survenue lors de l'enregistrement de l'e-mail du parent." };
  }
};
