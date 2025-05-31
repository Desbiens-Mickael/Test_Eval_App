"use client";
import { useSession } from "next-auth/react";

/**
 * Hook for getting the current role of the user.
 * @returns {string} the current role of the user
 */
export const useCurrentRole = () => {
  const session = useSession();

  return session.data?.user?.role;
};
