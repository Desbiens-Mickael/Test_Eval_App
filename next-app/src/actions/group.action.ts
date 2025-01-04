"use server";

import { createGroupData, getGroupsByAuthorId } from "@/data/group.data";
import { currentUser } from "@/lib/auth";
import { CreateGroupInput, createGroupSchema } from "@/shema-zod/group.shema";

// Récupérer tous les groupes de l'utilisateur connecté
export const getAllGroupsAction = async () => {
  const user = await currentUser();
  if (!user || !user.id || user.role !== "ADMIN") {
    return { error: "Action non autoriser !" };
  }

  try {
    const groups = await getGroupsByAuthorId(user.id);
    return { success: "Groupes trouvés.", data: groups };
  } catch (error) {
    console.error(error);
    return {
      error: "Une erreur est survenue lors de la récupération des groupes.",
    };
  }
};

// Création d'un groupe
export const createGroupAction = async (data: CreateGroupInput) => {
  const isDataValide = createGroupSchema.safeParse(data);
  console.log(data);
  if (!isDataValide.success) return { error: "Données non valide !" };

  const user = await currentUser();
  if (!user || !user.id || user.role !== "ADMIN") {
    return { error: "Action non autoriser !" };
  }

  try {
    const existingGroups = await getGroupsByAuthorId(user.id);
    // Vérifier si le groupe existe déja
    if (existingGroups.length > 0) {
      const existingGroup = existingGroups.find(
        (group) => group.name === data.name
      );

      if (existingGroup) {
        return { error: "Ce groupe existe déjà !" };
      }
    }

    // Créer le groupe
    const group = await createGroupData(data.name, user.id);
    return { success: "Groupe créer avec successe.", data: group };
  } catch (error) {
    console.error(error);
    return { error: "Une erreur est survenue lors de la création du groupe." };
  }
};
