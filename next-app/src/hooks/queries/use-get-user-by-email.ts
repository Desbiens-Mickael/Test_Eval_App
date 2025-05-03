import { getUserByEmailData } from "@/data/user-data";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook for getting a user by email.
 * @param {string} userEmail - the email of the user to get
 * @returns {Promise} a promise resolving to the user
 */
export const useGetUserByEmail = (userEmail: string) => {
  return useQuery({
    queryKey: ["userByEmail", userEmail],
    queryFn: ({ queryKey }) => {
      const [, email] = queryKey;
      if (typeof email === "string") {
        return getUserByEmailData(email);
      }
      throw new Error("Email is required and must be a string");
    },
    enabled: !!userEmail,
  });
};
