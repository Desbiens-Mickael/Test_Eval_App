import { cn } from "@/lib/utils";
import { ClipboardCheck, Dumbbell } from "lucide-react";

export const EXERCICE_KIND_LABELS = {
  CONTROL: {
    label: "Contrôle",
    description: "Noté, une seule tentative, compte dans la moyenne",
    icon: ClipboardCheck,
  },
  PRACTICE: {
    label: "Entraînement",
    description: "Non noté, essais illimités, ne compte pas dans la moyenne",
    icon: Dumbbell,
  },
} as const;

/** Badge « Contrôle » ou « Entraînement » d'un exercice */
export default function ExerciceKindBadge({
  kind,
  className,
}: {
  kind: "CONTROL" | "PRACTICE";
  className?: string;
}) {
  const { label, icon: Icon } = EXERCICE_KIND_LABELS[kind];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        kind === "PRACTICE"
          ? "border-sky-300 bg-sky-50 text-sky-800 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-200"
          : "border-orange-300 bg-orange-50 text-orange-800 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-200",
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </span>
  );
}
