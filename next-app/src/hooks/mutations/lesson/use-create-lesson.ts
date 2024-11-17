import { useMutation, UseMutateAsyncFunction, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import createNewLesson  from "@/actions/lesson/create-lesson";

export const useCreateLesson = (subjectId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createNewLesson,
        onSuccess: (data) => {
            if (data?.error) toast.error(data.error);
            if (data?.success) {
                toast.success(data.success);
                queryClient.invalidateQueries({ queryKey: ["allLessonsBySubject", subjectId] });
            };
        },
    });
};