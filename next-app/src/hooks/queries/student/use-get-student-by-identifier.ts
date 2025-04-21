import { getStudentByIdentifierAction } from "@/actions/student.action";
import { useQuery } from "@tanstack/react-query";

export const useGetStudentByIdentifier = (identifier: string) => {
  return useQuery({
    queryKey: ["studentByIdentifier", identifier],
    queryFn: ({ queryKey }) => {
      const [, identifier] = queryKey;
      if (typeof identifier === "string") {
        return getStudentByIdentifierAction(identifier);
      }
      throw new Error("Identifier is required and must be a string");
    },
    enabled: !!identifier,
  });
};
