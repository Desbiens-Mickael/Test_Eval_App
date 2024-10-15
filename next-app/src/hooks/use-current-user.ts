import { useSession } from "next-auth/react";

/**
 * Hook for getting the current user.
 * @returns {User} the current user
 */
export const useCurrentUser = () => {
  const session = useSession();

  return session.data?.user;
};
