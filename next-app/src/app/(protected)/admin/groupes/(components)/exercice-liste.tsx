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
        Aucun contrôle ni exercice pour cette leçon.
      </motion.div>
    );
  }

  // Contrôles et exercices dans deux listes distinctes, pour ne pas les confondre
  const sections = [
    { kind: "CONTROL" as const, title: "Contrôles (notés)" },
    { kind: "PRACTICE" as const, title: "Exercices (non notés)" },
  ];

  return (
    <div className="space-y-5">
      {sections.map((section) => {
        const items = exercices.filter((e) => e.kind === section.kind);
        return (
          <div key={section.kind} className="space-y-2">
            <h4 className="text-sm font-semibold text-muted-foreground">
              {section.title}
            </h4>
            {items.length === 0 ? (
              <p className="rounded-lg bg-muted/30 p-3 text-sm text-muted-foreground">
                {section.kind === "CONTROL"
                  ? "Aucun contrôle pour cette leçon."
                  : "Aucun exercice pour cette leçon."}
              </p>
            ) : (
              <AnimatePresence>
                {items.map((exercice, index) => {
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
                        kind={exercice.kind}
                        description={exercice.description}
                        level={exercice.level}
                        levelColor={exercice.levelColor}
                        type={exercice.type}
                        opensAt={exercice.opensAt}
                        closesAt={exercice.closesAt}
                        isActive={isActive}
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        );
      })}
    </div>
  );
}
