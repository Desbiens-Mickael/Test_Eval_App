import { cn } from "@/lib/utils";
import React from "react";

interface NoteDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  note: number;
  coeficient: number;
}

export const NoteDisplay: React.FC<NoteDisplayProps> = ({
  className,
  note,
  coeficient,
}) => {
  const getNoteColor = () => {
    const percentage = (note / coeficient) * 100;
    if (percentage >= 80) return "text-green-600 dark:text-green-400";
    if (percentage >= 60) return "text-yellow-600 dark:text-yellow-400";
    if (percentage >= 40) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1 rounded-full",
        "text-sm font-semibold",
        className
      )}
    >
      <span>Note</span>
      <span>
        <span className={cn("font-bold", getNoteColor())}>{note}</span>/
        {coeficient}
      </span>
    </div>
  );
};
