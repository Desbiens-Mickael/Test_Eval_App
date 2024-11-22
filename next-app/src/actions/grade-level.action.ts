"use server"

import { getAllGradeLevelData } from "@/data/grade-level.data";

export const getAllGradeLevelsAction = async () => {
  try {
    return await getAllGradeLevelData();
  } catch (error) {
    console.error(error);
    throw new Error("Une erreur est survenue lors de la récupération des niveaux.");
  }
};
  