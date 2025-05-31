"use client";
import { User } from "next-auth";
import { useSession } from "next-auth/react";

/**
 * Hook for getting the current user.
 * @returns {User | undefined} the current user
 */
export const useCurrentUser = () => {
  const { data: session } = useSession();

  return session?.user as User;
};
