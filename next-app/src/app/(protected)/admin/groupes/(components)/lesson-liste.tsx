"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Loader2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import SubjectLayout from "@/components/subject-layout";
import {
  AlertDialog,
  AlertDialogAction,
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
import ExerciceListe from "./exercice-liste";

interface LessonListeProps {
  lessons: Lesson[];
  groupId: string;
}

export default function LessonListe({ lessons, groupId }: LessonListeProps) {
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);
  const { mutateAsync: removeLessonFromGroup, isPending } =
    useRemoveLessonFromGroup();

  const toggleLesson = (lessonId: string) => {
    setExpandedLesson(expandedLesson === lessonId ? null : lessonId);
  };

  const handleRemoveLesson = async (lessonId: string) => {
    try {
      await toast.promise(
        removeLessonFromGroup({
          groupId,
          lessonId,
        }),
        {
          loading: "Suppression en cours...",
          success: (data) => data.success,
          error: (data) =>
            data.error ||
            "Une erreur est survenue pendant la suppression. Veuillez réessayer.",
        }
      );
    } catch (error) {
      console.error("Error removing lesson:", error);
    }
  };

  if (lessons.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 text-center rounded-lg bg-muted/30"
      >
        <p className="text-muted-foreground">
          {"Aucune leçon n'a été ajoutée à ce groupe."}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {lessons.map((lesson) => (
          <motion.div
            key={lesson.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className="relative group bg-card rounded-lg border overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between p-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleLesson(lesson.id)}
                    className="p-1 -ml-2 rounded-full hover:bg-muted transition-colors"
                    aria-label={
                      expandedLesson === lesson.id ? "Réduire" : "Développer"
                    }
                  >
                    <ChevronDown
                      className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
                        expandedLesson === lesson.id ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <h3 className="text-lg font-semibold truncate">
                    {lesson.title}
                  </h3>
                </div>

                <div className="flex gap-2 mt-2 ml-8 flex-wrap">
                  <SubjectLayout
                    label={lesson.subject}
                    color={lesson.subjectColor}
                    className="text-sm"
                  />
                  <SubjectLayout
                    label={lesson.gradeLevel}
                    color={lesson.gradeLevelColor}
                    className="text-sm"
                  />
                </div>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Retirer la leçon</AlertDialogTitle>
                    <AlertDialogDescription>
                      Êtes-vous sûr de vouloir retirer cette leçon du groupe ?
                      Cette action est irréversible.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>
                      Annuler
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemoveLesson(lesson.id);
                      }}
                      className="bg-destructive hover:bg-destructive/90"
                      disabled={isPending}
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Suppression...
                        </>
                      ) : (
                        "Retirer"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <AnimatePresence>
              {expandedLesson === lesson.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="border-t p-4 bg-muted/10">
                    <ExerciceListe groupId={groupId} lessonId={lesson.id} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
