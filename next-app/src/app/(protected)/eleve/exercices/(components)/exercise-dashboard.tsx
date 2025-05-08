"use client";

import { useState } from "react";
import { LessonSubjectChips } from "../../../../../components/lesson/LessonSubjectChips";
import ListExercisesToDo from "./list-exercises-to-do";

export default function ExerciseDashboard() {
  const [selectedSubject, setSelectedSubject] = useState<string | undefined>(
    undefined
  );

  return (
    <div className="flex flex-col gap-10">
      <LessonSubjectChips
        selectedSubject={selectedSubject}
        onClick={setSelectedSubject}
      />

      <ListExercisesToDo selectedSubject={selectedSubject} />
    </div>
  );
}
