"use client";

import { useState } from "react";
import { LessonSubjectChips } from "./LessonSubjectChips";
import ListExercisesDone from "./list-exercises-done";

export default function ExerciseDoneDashboard() {
  const [selectedSubject, setSelectedSubject] = useState<string | undefined>(
    undefined
  );

  return (
    <div className="flex flex-col gap-10">
      <LessonSubjectChips
        selectedSubject={selectedSubject}
        onClick={setSelectedSubject}
      />

      <ListExercisesDone selectedSubject={selectedSubject} />
    </div>
  );
}
