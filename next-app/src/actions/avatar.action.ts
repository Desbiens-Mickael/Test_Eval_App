"use server";

import { UpdateUserData, getUserByIdData } from "@/data/user-data";
import { currentUser } from "@/lib/auth";

export const updateAvatarAction = async (imgPath: string) => {
  const user = await currentUser();
  if (!user || !user.id) return { error: "Action non autorisé!" };

  const dbUser = await getUserByIdData(user.id);
  if (!dbUser) return { error: "Action non autorisé!" };

  await UpdateUserData(dbUser.id, { image: imgPath });
  return { success: "Image modifier avec succes." };
}; 
