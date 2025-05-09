import { deleteLessonsAction } from "@/actions/lesson.action";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteLessons = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lessonIds: string[]) => {
      const response = await deleteLessonsAction(lessonIds);
      // Si la réponse contient une erreur, on la rejette
      if (response.error) {
        throw response;
      }
      return response;
    },
    onSuccess: (data) => {
      if (data?.success && data.data) {
        // Invalidate queries for each affected subject
        const subjects = new Set(
          data.data.map((lesson) => lesson.LessonSubject.label)
        );
        subjects.forEach((subject) => {
          queryClient.invalidateQueries({
            queryKey: ["allLessonsBySubject", subject],
          });
        });

        // Remove specific lesson queries
        data.data.forEach((lesson) => {
          queryClient.removeQueries({
            queryKey: ["lessonBySlug", lesson.slug],
          });
        });

        const clientDomainApi = process.env.NEXT_PUBLIC_CLIENT_DOMAIN_API;
        // Delete the images
        data.data.forEach(async (lesson) => {
          if (lesson.imageBanner) {
            const img = lesson.imageBanner.split("/").pop();
            if (img) {
              const response = await fetch(`${clientDomainApi}/lesson/${img}`, {
                method: "DELETE",
              });
              if (!response.ok) {
                toast.error(
                  "Une erreur c'est produite lors de la suppression de l'image !"
                );
                return;
              }
            }
          }
        });
      }
      return data;
    },
  });
};
