"use server";

import { getAllExerciceLevelsWithLabelAndColorOnlyData } from "@/data/exercice-level/exercice-level-data";
import { Level } from "@/type/level";

export const getExerciceLevelsAction = async (): Promise<Level[]> => {
  try {
    return await getAllExerciceLevelsWithLabelAndColorOnlyData();
  } catch (error) {
    console.error(error);
    throw new Error("Error while getting all exercice levels");
  }
};
