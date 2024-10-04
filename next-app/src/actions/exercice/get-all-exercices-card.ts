"use server";

import { Exercice } from "@/app/(protected)/admin/card-game/_components/table-cards";
import { getAllExerciceByType } from "@/data/exercice/exercice-data";

const getAllExercicesCard = async () => {
  try {
    const exercices = await getAllExerciceByType("Card");

    const exercicesCard: Exercice[] = exercices.map((exercice) => ({
      id: exercice.id,
      title: exercice.title,
      lesson: exercice.lesson.name,
      level: exercice.level.label,
      subject: exercice.lesson.LessonSubject.label,
    }));

    return exercicesCard;
  } catch (error) {
    console.error(error);
    throw new Error("Error while getting all exercices");
  }
};

export default getAllExercicesCard;
