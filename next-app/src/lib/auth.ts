import { getStudentByIdData } from "@/data/student-data";
import { auth } from "auth";

/**
 * Utilisateur de la session. Un élève dont le compte a été désactivé
 * pendant qu'il était connecté n'est plus considéré comme connecté :
 * toutes les actions serveur le refusent.
 */
export const currentUser = async () => {
  const session = await auth();
  const user = session?.user;

  if (user?.role === "STUDENT" && user.id) {
    const student = await getStudentByIdData(user.id);
    if (!student || student.disabledAt) return undefined;
  }

  return user;
};

export const currentRole = async () => {
  const session = await auth();

  return session?.user?.role;
};
