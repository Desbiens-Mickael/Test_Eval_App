import { getCurrentUserProfileAction } from "@/actions/user-info.action";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook pour récupérer le profil du professeur connecté.
 * Le paramètre `userEmail` sert uniquement de clé de cache : le serveur
 * renvoie toujours le profil de l'utilisateur en session.
 * @param {string} userEmail - l'email de l'utilisateur connecté
 */
export const useGetUserByEmail = (userEmail: string) => {
  return useQuery({
    queryKey: ["userByEmail", userEmail],
    queryFn: () => getCurrentUserProfileAction(),
    enabled: !!userEmail,
  });
};
