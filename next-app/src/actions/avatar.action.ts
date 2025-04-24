"use server";

import {
  getStudentByIdentifierlData,
  UpdateStudentData,
} from "@/data/student-data";
import { UpdateUserData, getUserByIdData } from "@/data/user-data";
import { currentUser } from "@/lib/auth";

export const updateAvatarAction = async (imgPath: string) => {
  const user = await currentUser();
  if (!user || !user.id) return { error: "Action non autorisé!" };

  const existingUser = await getUserByIdData(user.id);
  if (!existingUser) return { error: "Action non autorisé!" };

  await UpdateUserData(existingUser.id, { image: imgPath });
  return { success: "Image modifier avec succes." };
};

export const updateStudentAvatarAction = async (imgPath: string) => {
  const student = await currentUser();
  if (!student || !student.identifier) return { error: "Action non autorisé!" };

  const existingStudent = await getStudentByIdentifierlData(student.identifier);
  if (!existingStudent) return { error: "Action non autorisé!" };

  await UpdateStudentData(existingStudent.id, { image: imgPath });
  return { success: "Image modifier avec succes." };
};
