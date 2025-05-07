"use client";

import SubjectLayout from "@/components/subject-layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useRemoveLessonFromGroup } from "@/hooks/mutations/group/use-remove-lesson-from-group";
import { Lesson } from "@/type/lesson";
import { X } from "lucide-react";
import { toast } from "sonner";
import ExerciceListe from "./exercice-liste";

interface LessonListeProps {
  lessons: Lesson[];
  groupId: string;
}

export default function LessonListe({ lessons, groupId }: LessonListeProps) {
  const { mutateAsync: removeLessonFromGroup } = useRemoveLessonFromGroup();

  const handleRemoveLesson = async (lessonId: string) => {
    toast.promise(
      removeLessonFromGroup({
        groupId: groupId,
        lessonId: lessonId,
      }),
      {
        loading: "Suppression en cours...",
        success: (data) => data.success,
        error: (data) =>
          data.error ||
          "Une erreur c'est produite pendant la suppression ! Veuillez réessayer.",
      }
    );
  };

  return (
    <div className="flex flex-col gap-2 py-2">
      {lessons.length === 0 ? (
        <h3 className="text-xl font-bold text-center">Aucune leçon</h3>
      ) : (
        lessons.map((lesson) => (
          <div className="w-full flex gap-4" key={lesson.id}>
            <Accordion type="single" collapsible className="flex-1">
              <AccordionItem value="item-1">
                <AccordionTrigger className="hover:no-underline hover:shadow-xl">
                  <div className="flex-1 flex items-center gap-2 rounded-md p-2">
                    <h3 className="text-lg font-bold text-foreground">
                      {lesson.title}
                    </h3>
                    <div className="flex gap-2">
                      <SubjectLayout
                        label={lesson.subject}
                        color={lesson.subjectColor}
                      />
                      <SubjectLayout
                        label={lesson.gradeLevel}
                        color={lesson.gradeLevelColor}
                      />
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4">
                  <ExerciceListe groupId={groupId} lessonId={lesson.id} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <AlertDialog>
              <AlertDialogTrigger asChild className="mt-4">
                <Button variant="destructiveInverted" size="icon">
                  <X size={25} />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Retirer la leçon du groupe
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Êtes-vous sur de vouloirs retirer cette leçon du groupe ?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuller</AlertDialogCancel>
                  <Button
                    variant="destructive"
                    className="w-fit"
                    onClick={() => {
                      handleRemoveLesson(lesson.id);
                    }}
                  >
                    Retirer
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ))
      )}
    </div>
  );
}
