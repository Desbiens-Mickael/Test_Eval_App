"use server";

import { UpdateUser, getUserById } from "@/data/user-data";
import { currentUser } from "@/lib/auth";
import { hashPassword, verifyPassword } from "@/lib/hash-password";
import { userSecurityFormSchema } from "@/type/shema-zod";
import { z } from "zod";

const updateUserSecurity = async (values: z.infer<typeof userSecurityFormSchema>) => {
  const user = await currentUser();
  if (!user || !user.id) return { error: "Action non autorisé!" };

  const dbUser = await getUserById(user.id);
  if (!dbUser || !dbUser.password) return { error: "Action non autorisé!" };

  if (values.password && values.newPassword) {
    const veriedPassword = await verifyPassword(dbUser.password, values.password);
    if (!veriedPassword) return { error: "Mot de passe invalide!" };

    const hashedPassword = await hashPassword(values.newPassword);
    values.password = hashedPassword;
    values.newPassword = undefined;
  }

  await UpdateUser(user.id, values);
  return { success: "Vos infos de sécurité ont bien été mise à jour." };
};

export default updateUserSecurity;
