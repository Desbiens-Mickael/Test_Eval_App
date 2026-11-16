"use client";

import { useState } from "react";
import { LearningDashboard } from "../../(components)/learning-dashboard";
import ListExercisesToDo from "./list-exercises-to-do";

export default function ExerciseDashboard() {
  const [selectedSubject, setSelectedSubject] = useState<string | undefined>(
    undefined
  );

  return (
    <LearningDashboard
      title="Mes contrôles"
      description="Les contrôles comptent dans ta moyenne : une seule tentative par contrôle"
      selectedSubject={selectedSubject}
      onSubjectChange={setSelectedSubject}
    >
      <ListExercisesToDo selectedSubject={selectedSubject} />
    </LearningDashboard>
  );
}
