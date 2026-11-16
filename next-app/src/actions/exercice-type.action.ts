"use server";

import { getAllExerciceTypeData } from "@/data/exercice/exercice-type.data";

export const getAllExercicesTypeAction = async () => {
  try {
    const exerciceType = await getAllExerciceTypeData();
    if (!exerciceType || exerciceType.length === 0) {
      return { error: "Aucun format trouvé" };
    }

    return {
      success: "Formats trouvés",
      data: exerciceType,
    };
  } catch (err) {
    console.error(err);
    return { error: "Erreur lors de la récupération des formats" };
  }
};
