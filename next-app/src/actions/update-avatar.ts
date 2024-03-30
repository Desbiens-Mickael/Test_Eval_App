"use server";

import { UpdateUser, getUserById } from "@/data/user-data";
import { currentUser } from "@/lib/auth";

const updateAvatar = async (imgPath: string) => {
  const user = await currentUser();
  if (!user || !user.id) return { error: "Action non autorisé!" };

  const dbUser = await getUserById(user.id);
  if (!dbUser) return { error: "Action non autorisé!" };

  await UpdateUser(dbUser.id, { image: imgPath });
  return { success: "Image modifier avec succes." };
};

export default updateAvatar;
