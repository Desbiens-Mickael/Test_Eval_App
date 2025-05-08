"use client";

import { useState } from "react";
import { LessonSubjectChips } from "../../../../../components/lesson/LessonSubjectChips";
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
    <div className="flex flex-col gap-10">
      <LessonSubjectChips
        selectedSubject={selectedSubject}
        onClick={setSelectedSubject}
      />

      <ListExercisesDone
        selectedSubject={selectedSubject}
        studentId={studentId}
      />
    </div>
  );
}
