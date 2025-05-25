"use client";

import { useState } from "react";
import { LearningDashboard } from "../../(components)/learning-dashboard";
import ListExercisesDone from "./list-exercises-done";

interface ExerciseDoneDashboardProps {
  studentId?: string;
}

export default function ExerciseDoneDashboard({
  studentId,
}: ExerciseDoneDashboardProps) {
  const [selectedSubject, setSelectedSubject] = useState<string | undefined>(
    undefined
  );

  return (
    <LearningDashboard
      title="Mes exercices"
      description="Parcourez et révisez vos exercices par matière"
      selectedSubject={selectedSubject}
      onSubjectChange={setSelectedSubject}
    >
      <ListExercisesDone
        selectedSubject={selectedSubject}
        studentId={studentId}
      />
    </LearningDashboard>
  );
}
