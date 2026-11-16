"use server";

import {
  getStudentExerciceByIdData,
  updateStudentExerciceReviewData,
} from "@/data/exercice/exercice-data";
import {
  createNotificationCorrectionData,
  createStudentNotificationData,
} from "@/data/notification/notification.data";
import { currentUser } from "@/lib/auth";
import { areResultsVisible } from "@/lib/control-period";
import {
  ExerciceReviewInput,
  buildExerciceReviewSchema,
  roundReviewNote,
} from "@/shema-zod/exercice-review.shema";

/**
 * Le professeur ajuste la note d'une copie et/ou laisse un commentaire.
 * La note automatique d'origine est conservée dans `autoNote`, et l'élève
 * reçoit une notification.
 */
export const reviewStudentExerciceAction = async (
  studentExerciceId: string,
  input: ExerciceReviewInput
) => {
  const user = await currentUser();
  if (!user?.id || user.role !== "ADMIN") {
    return { error: "Action non autoriser !" };
  }

  const studentExercice = await getStudentExerciceByIdData(studentExerciceId);
  // Seul le professeur de l'élève peut relire sa copie
  if (!studentExercice || studentExercice.student.professorId !== user.id) {
    return { error: "Correction non trouvée" };
  }

  const parsed = buildExerciceReviewSchema(studentExercice.coeficient).safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Données non valide !" };
  }

  const note = roundReviewNote(parsed.data.note);
  const comment = parsed.data.comment || null;
  const autoNote = studentExercice.autoNote ?? studentExercice.note;

  const nothingChanged =
    note === studentExercice.note &&
    comment === (studentExercice.teacherComment ?? null);
  if (nothingChanged) {
    return { success: "Aucune modification à enregistrer." };
  }

  try {
    const updated = await updateStudentExerciceReviewData(studentExerciceId, {
      note,
      autoNote,
      teacherComment: comment,
    });

    // Notification à l'élève (une erreur ici n'annule pas la relecture).
    // Avant la clôture du contrôle, l'élève ne voit pas encore sa copie :
    // il sera prévenu par la notification de clôture.
    try {
      if (areResultsVisible({ closesAt: studentExercice.exercice?.closesAt })) {
        const title = studentExercice.exercice?.title ?? "ton contrôle";
        const noteChanged = note !== studentExercice.note;
        const notification = await createNotificationCorrectionData({
          completionId: studentExerciceId,
          createdByTeacherId: user.id,
          message: noteChanged
            ? `Ta note pour « ${title} » a été ajustée : ${note}/${studentExercice.coeficient}`
            : `Ton professeur a commenté ta copie « ${title} »`,
        });
        await createStudentNotificationData(notification.id, [
          { id: studentExercice.studentId },
        ]);
      }
    } catch (error) {
      console.error("Error notifying student about review:", error);
    }

    return { success: "La correction a été enregistrée.", data: updated };
  } catch (error) {
    console.error("Error saving review:", error);
    return {
      error: "Une erreur est survenue lors de l'enregistrement de la correction.",
    };
  }
};
