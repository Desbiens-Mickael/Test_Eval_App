"use client";

import ExerciceTypeBadge from "@/app/(protected)/eleve/(learning)/exercices/(components)/exercice-type-badge";
import SubjectLayout from "@/components/subject-layout";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToggleExerciceGroup } from "@/hooks/mutations/exercice/use-toggle-exercice-group";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";

interface ExerciceListeItemProps {
  exerciceId: string;
  groupId: string;
  title: string;
  description: string;
  level: string;
  levelColor: string;
  type: string;
  isActive: boolean | undefined;
}

export default function ExerciceListeItem({
  exerciceId,
  groupId,
  title,
  description,
  level,
  levelColor,
  type,
  isActive,
}: ExerciceListeItemProps) {
  const { mutate, isPending } = useToggleExerciceGroup();

  const handleToggle = (checked: boolean) => {
    if (isPending) return;

    mutate({
      exerciceId,
      groupId,
    });
  };

  return (
    <div
      className={cn(
        "group relative p-4 rounded-lg transition-colors",
        isActive
          ? "bg-primary/5 border border-primary/20"
          : "bg-card border border-border hover:border-muted-foreground/30"
      )}
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-semibold text-foreground line-clamp-1">
                {title}
              </h3>

              <div className="flex items-center gap-1.5">
                <ExerciceTypeBadge type={type} />
                <SubjectLayout
                  label={level}
                  color={levelColor}
                  className="text-xs py-0.5"
                />
              </div>
            </div>

            {description && (
              <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
                {description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 sm:ml-auto">
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    "flex items-center justify-center h-8 w-8 rounded-full transition-colors",
                    isActive
                      ? "text-green-600 bg-green-100 dark:bg-green-900/30"
                      : "text-muted-foreground bg-muted"
                  )}
                >
                  {isActive ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {isActive
                  ? "Activé pour ce groupe"
                  : "Désactivé pour ce groupe"}
              </TooltipContent>
            </Tooltip>

            <Switch
              checked={isActive}
              onCheckedChange={handleToggle}
              disabled={isPending}
              className={cn(
                "data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted-foreground/30",
                isPending && "opacity-50 cursor-not-allowed"
              )}
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isPending && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg"
          >
            <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
