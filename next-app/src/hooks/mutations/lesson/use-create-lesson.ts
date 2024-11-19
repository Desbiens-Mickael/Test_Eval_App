import { createLessonAction } from "@/actions/lesson.action";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateLesson = (subject: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createLessonAction,
        onSuccess: (data) => {
            if (data?.error) return data.error;
            if (data?.success) {
                queryClient.invalidateQueries({ queryKey: ["allLessonsBySubject", subject] });
                return data.success;
            };
        },
    });
};