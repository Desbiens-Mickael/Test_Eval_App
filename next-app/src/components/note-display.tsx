import { cn } from "@/lib/utils";
import React from "react";

interface NoteDisplayProps {
  note: number;
  coeficient: number;
  className?: string;
}

export const NoteDisplay: React.FC<NoteDisplayProps> = ({
  note,
  coeficient,
  className = "",
}) => {
  return (
    <span className={cn("text-lg font-bold", className)}>
      Note:{" "}
      <span className="text-primary">
        {note}/{coeficient}
      </span>
    </span>
  );
};
