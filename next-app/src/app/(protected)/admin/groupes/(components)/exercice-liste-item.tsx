"use client";

import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

interface ExerciceListeItemProps {
  id: string;
  title: string;
  description: string;
  level: string;
  levelColor: string;
  type: string;
  isActive: boolean;
}

export default function ExerciceListeItem({
  id,
  title,
  description,
  level,
  levelColor,
  type,
  isActive,
}: ExerciceListeItemProps) {
  const handleToggle = () => {
    console.log("Toggle", id);
  };

  return (
    <div className="w-full flex gap-10 py-2">
      <div className="w-full flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-accents">{title}</h3>
          <Badge className="text-slate-500 border-slate-500 bg-background">
            {type}
          </Badge>
          <Badge
            className={`${levelColor} text-background hover:${levelColor}`}
          >
            {level}
          </Badge>
          <div className="w-fit flex items-center ms-auto">
            <Switch checked={isActive} onCheckedChange={handleToggle} />
          </div>
        </div>
        <p>{description}</p>
      </div>
    </div>
  );
}
