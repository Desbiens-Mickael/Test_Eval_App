import { getUserByEmail } from "@/data/user-data";
import { useQuery } from "@tanstack/react-query";

export const useUserByEmail = (userEmail: string | null | undefined) => {
  return useQuery({
    queryKey: ["userById", userEmail],
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
