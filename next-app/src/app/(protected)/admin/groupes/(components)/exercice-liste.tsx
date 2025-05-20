"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import useGetAllExercicesByLessonId from "@/hooks/queries/exercice/use-get-all-exercises-by-lessonId";
import ExerciceListeItem from "./exercice-liste-item";

interface ExerciceListeProps {
  groupId: string;
  lessonId: string;
}

export default function ExerciceListe({ groupId, lessonId }: ExerciceListeProps) {
  const { data: exercices, isLoading, error } = useGetAllExercicesByLessonId(lessonId);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 text-sm text-destructive bg-destructive/10 rounded-lg"
      >
        Une erreur est survenue lors du chargement des exercices.
      </motion.div>
    );
  }

  if (!exercices || exercices.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 text-center text-muted-foreground bg-muted/30 rounded-lg"
      >
        Aucun exercice trouvé pour cette leçon.
      </motion.div>
    );
  }

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {exercices.map((exercice, index) => {
          const isActive = !!exercice.groups?.some(
            (group) => group.id === groupId
          );
          
          return (
            <motion.div
              key={exercice.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              exit={{ opacity: 0, height: 0 }}
              className="relative"
            >
              <ExerciceListeItem
                exerciceId={exercice.id}
                groupId={groupId}
                title={exercice.title}
                description={exercice.description}
                level={exercice.level}
                levelColor={exercice.levelColor}
                type={exercice.type}
                isActive={isActive}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
