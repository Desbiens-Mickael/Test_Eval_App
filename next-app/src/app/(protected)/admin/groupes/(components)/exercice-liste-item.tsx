"use client";

import ExerciceTypeBadge from "@/app/(protected)/eleve/exercices/(components)/exercice-type-badge";
import SubjectLayout from "@/components/subject-layout";
import { Switch } from "@/components/ui/switch";
import { useToggleExerciceGroup } from "@/hooks/mutations/exercice/use-toggle-exercice-group";

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
  const { mutate } = useToggleExerciceGroup();

  const handleToggle = () => {
    mutate({
      exerciceId: exerciceId,
      groupId: groupId,
    });
  };

  return (
    <div className="w-full flex gap-10 py-2">
      <div className="w-full flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-accents">{title}</h3>
          <ExerciceTypeBadge type={type} />
          <SubjectLayout label={level} color={levelColor} />
          <div className="w-fit flex items-center ms-auto">
            <Switch checked={isActive} onCheckedChange={() => handleToggle()} />
          </div>
        </div>
        <p>{description}</p>
      </div>
    </div>
  );
}
