import { updateLessonAction } from "@/actions/lesson.action";
import { CreateLessonInput } from "@/shema-zod/lesson.shema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateLesson = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({lessonId, data}: {lessonId: string, data: CreateLessonInput}) => updateLessonAction(lessonId, data),
        onSuccess: (data) => {
            if (data?.error) return data.error;
            if (data?.success) {
                const subject = data.data.LessonSubject.label;
                const slug = data.data.slug;
                queryClient.invalidateQueries({ queryKey: ["allLessonsBySubject", subject] });
                queryClient.invalidateQueries({ queryKey: ["lessonBySlug", slug] });
                return data.success;
            };
        }
    });
};