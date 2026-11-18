// Couche d'accès aux données : uniquement côté serveur.
import "server-only";

import { getParentsToNotifyData } from "@/data/parent-data";
import { prisma } from "@/lib/db";
import { sendParentResultsEmail } from "@/lib/mail";

/**
 * Prévient par e-mail les parents (notifications activées) qu'une note est
 * disponible pour leur enfant. Un e-mail par parent, qui regroupe ses enfants.
 * Une erreur d'envoi est journalisée sans gêner l'action appelante.
 */
export const notifyParentsOfResultsSafe = async (
  results: { studentId: string; title: string }[]
) => {
  try {
    if (results.length === 0) return;
    const studentIds = Array.from(new Set(results.map((r) => r.studentId)));
    const parents = await getParentsToNotifyData(studentIds);
    if (parents.length === 0) return;

    const students = await prisma.student.findMany({
      where: { id: { in: studentIds } },
      select: { id: true, name: true },
    });
    const nameById = new Map(students.map((s) => [s.id, s.name]));

    await Promise.all(
      parents.map(async (parent) => {
        const mine = results
          .filter((r) => parent.studentIds.includes(r.studentId))
          .map((r) => ({ childName: nameById.get(r.studentId) ?? "Votre enfant", title: r.title }));
        if (mine.length === 0) return;
        try {
          await sendParentResultsEmail(parent.email, mine);
        } catch (error) {
          console.error("Envoi de l'e-mail de note à un parent :", error);
        }
      })
    );
  } catch (error) {
    console.error("Notification des parents :", error);
  }
};
