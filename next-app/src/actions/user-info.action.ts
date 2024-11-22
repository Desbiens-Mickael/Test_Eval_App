"use server";

import { UpdateUserData, getUserByEmailData, getUserByIdData } from "@/data/user-data";
import { currentUser } from "@/lib/auth";
import { capitalize } from "@/lib/utils";
import { userInfosFormSchema } from "@/type/shema-zod";
import { z } from "zod";

export const updateUserInfosAction = async (infos: z.infer<typeof userInfosFormSchema>) => {
  const infosValide = userInfosFormSchema.safeParse(infos);
  if (!infosValide.success) return { error: "Données non-valide!" };

  const user = await currentUser();
  if (!user || !user.id) return { error: "Action non autoriser!1" };

  const dbUser = await getUserByIdData(user.id);
  if (!dbUser) return { error: "Action non autoriser!2" };

  if (user?.isOAuth) {
    infos.email = undefined;
  }

  if (infos.email && infos.email !== dbUser.email) {
    const existingUser = await getUserByEmailData(infos.email);

    if (existingUser && existingUser.id !== dbUser.id) return { error: "Email déjà utilisé!3" };

    return { success: "Email modifié avec succès." };
  }

  let name = undefined;
  if (infos.firstname && infos.lastname) {
    name = `${capitalize(infos.firstname)} ${capitalize(infos.lastname)}`;
  }

  await UpdateUserData(dbUser.id, { name });

  return { success: "Vos infos ont été modifiées avec succès." };
};
