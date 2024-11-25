import { createLessonAction } from "@/actions/lesson.action";
import { CreateLessonInput } from "@/shema-zod/lesson.shema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateLesson = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateLessonInput) => createLessonAction(data),
        onSuccess: (data) => {
            if (data?.error) return data.error;
            if (data?.success) {
                const subject = data.data.LessonSubject.label;
                queryClient.invalidateQueries({ queryKey: ["allLessonsBySubject", subject] });
                return data.success;
            };
        }
    });
};