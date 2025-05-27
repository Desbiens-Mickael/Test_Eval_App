"use client";

import { useState } from "react";
import { LearningDashboard } from "../../(components)/learning-dashboard";
import LessonList from "./lesson-list";

export default function LessonDashboard() {
  const [selectedSubject, setSelectedSubject] = useState<string | undefined>(
    undefined
  );

  return (
    <LearningDashboard
      title="Mes leçons"
      description="Parcourez et révisez vos leçons par matière"
      selectedSubject={selectedSubject}
      onSubjectChange={setSelectedSubject}
    >
      <LessonList
        key={selectedSubject || "all"}
        selectedSubject={selectedSubject}
      />
    </LearningDashboard>
  );
}
