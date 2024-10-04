"use server";

import { getAllExerciceLevelsWithLabelAndColorOnly } from "@/data/exercice-level/exercice-level-data";

const getExerciceLevels = async () => {
  try {
    return await getAllExerciceLevelsWithLabelAndColorOnly();
  } catch (error) {
    console.error(error);
    throw new Error("Error while getting all exercice levels");
  }
};

export default getExerciceLevels;
