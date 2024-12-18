"use server";

import { getAllExerciceTypeData } from "@/data/exercice/exercice-type.data";

export const getAllExercicesTypeAction = async () => {
  try {
    const exerciceType = await getAllExerciceTypeData();
    if (!exerciceType || exerciceType.length === 0) {
      return { error: "Aucun type d'exercice trouvé" };
    }

    return {
      success: "Types d'exercices trouvés",
      data: exerciceType,
    };
  } catch (err) {
    console.error(err);
    return { error: "Erreur lors de la récupération des types d'exercices" };
  }
};
