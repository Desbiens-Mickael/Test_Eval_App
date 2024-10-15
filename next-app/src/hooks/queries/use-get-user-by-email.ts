import { getUserByEmail } from "@/data/user-data";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook for getting a user by email.
 * @param {string} userEmail - the email of the user to get
 * @returns {Promise} a promise resolving to the user
 */
export const useUserByEmail = (userEmail: string | null | undefined) => {
  return useQuery({
    queryKey: ["userByEmail", userEmail],
    queryFn: ({ queryKey }) => {
      const [, email] = queryKey;
      if (typeof email === "string") {
        return getUserByEmail(email);
      }
      throw new Error("Email is required and must be a string");
    },
    enabled: !!userEmail,
  });
};
