"use server";

import { getAllExerciceLevelsWithLabelAndColorOnly } from "@/data/exercice-level/exercice-level-data";
import { Level } from "@/type/level";

const getExerciceLevels = async (): Promise<Level[]> => {
  try {
    return await getAllExerciceLevelsWithLabelAndColorOnly();
  } catch (error) {
    console.error(error);
    throw new Error("Error while getting all exercice levels");
  }
};

export default getExerciceLevels;
