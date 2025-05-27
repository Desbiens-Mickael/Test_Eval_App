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
      title="Mes exercices"
      description="Pratiquez et révisez vos exercices par matière"
      selectedSubject={selectedSubject}
      onSubjectChange={setSelectedSubject}
    >
      <ListExercisesToDo selectedSubject={selectedSubject} />
    </LearningDashboard>
  );
}
