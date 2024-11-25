"use server";

import { getAllGradeLevelsWithLabelAndColorOnlyData } from "@/data/grade-level.data";

export const getAllGradeLevelsAction = async () => {
  try {
    return await getAllGradeLevelsWithLabelAndColorOnlyData();
  } catch (error) {
    console.error(error);
    throw new Error(
      "Une erreur est survenue lors de la récupération des niveaux."
    );
  }
};
