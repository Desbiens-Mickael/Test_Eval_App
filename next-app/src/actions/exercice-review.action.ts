"use server";

import {
  getStudentExerciceByIdData,
  saveFreeResponseReviewData,
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
  FreeResponseReviewInput,
  buildExerciceReviewSchema,
  buildFreeResponseReviewSchema,
  freeResponseNote,
  roundReviewNote,
} from "@/shema-zod/exercice-review.shema";
import {
  FREE_RESPONSE_TYPE,
  contentFreeResponseShema,
} from "@/shema-zod/exercice.shema";
import { notifyParentsOfResultsSafe } from "@/data/parent-notify.data";

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

  // Une réponse libre se corrige question par question
  if (studentExercice.exercice?.type.name === FREE_RESPONSE_TYPE) {
    return { error: "Cette copie se corrige question par question." };
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
        if (noteChanged) {
          await notifyParentsOfResultsSafe([
            { studentId: studentExercice.studentId, title: `${title} (note ajustée)` },
          ]);
        }
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

/**
 * Le professeur corrige une copie « Réponse libre » : des points et un
 * commentaire par question, plus un commentaire général. La note finale
 * ramène les points obtenus sur le coefficient. La copie quitte l'état
 * « en attente » et l'élève est prévenu dès que ses résultats sont visibles.
 * La correction peut être modifiée ensuite.
 */
export const reviewFreeResponseAction = async (
  studentExerciceId: string,
  input: FreeResponseReviewInput
) => {
  const user = await currentUser();
  if (!user?.id || user.role !== "ADMIN") {
    return { error: "Action non autoriser !" };
  }

  const studentExercice = await getStudentExerciceByIdData(studentExerciceId);
  if (
    !studentExercice ||
    studentExercice.student.professorId !== user.id ||
    studentExercice.exercice?.type.name !== FREE_RESPONSE_TYPE
  ) {
    return { error: "Correction non trouvée" };
  }

  const content = contentFreeResponseShema.safeParse(studentExercice.exercice.content);
  if (!content.success) {
    return { error: "Le contenu de ce contrôle est invalide." };
  }
  const maxPoints = content.data.map((q) => q.points);

  const parsed = buildFreeResponseReviewSchema(maxPoints).safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Données non valide !" };
  }

  const questionReviews = parsed.data.reviews.map((r) => ({
    points: r.points,
    comment: r.comment || null,
  }));
  const note = freeResponseNote(questionReviews, maxPoints, studentExercice.coeficient);
  const wasPending = studentExercice.pendingReview;

  try {
    const updated = await saveFreeResponseReviewData(studentExerciceId, {
      note,
      teacherComment: parsed.data.comment || null,
      questionReviews,
    });

    // Notification à l'élève (une erreur ici n'annule pas la correction).
    // Avant la clôture du contrôle, il sera prévenu par la notification de clôture.
    try {
      if (areResultsVisible({ closesAt: studentExercice.exercice.closesAt })) {
        const title = studentExercice.exercice.title;
        const notification = await createNotificationCorrectionData({
          completionId: studentExerciceId,
          createdByTeacherId: user.id,
          message: wasPending
            ? `Ta copie « ${title} » a été corrigée : ${note}/${studentExercice.coeficient}`
            : `La correction de « ${title} » a été modifiée : ${note}/${studentExercice.coeficient}`,
        });
        await createStudentNotificationData(notification.id, [
          { id: studentExercice.studentId },
        ]);
        await notifyParentsOfResultsSafe([
          {
            studentId: studentExercice.studentId,
            title: wasPending ? title : `${title} (correction modifiée)`,
          },
        ]);
      }
    } catch (error) {
      console.error("Error notifying student about free response review:", error);
    }

    return { success: "La correction a été enregistrée.", data: updated };
  } catch (error) {
    console.error("Error saving free response review:", error);
    return {
      error: "Une erreur est survenue lors de l'enregistrement de la correction.",
    };
  }
};
