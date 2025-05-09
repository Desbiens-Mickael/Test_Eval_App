"use client";

import { LessonSubjectChips } from "@/components/lesson/LessonSubjectChips";
import { useState } from "react";
import LessonList from "./lesson-list";

export default function LessonDashboard() {
  const [selectedSubject, setSelectedSubject] = useState<string | undefined>(
    undefined
  );

  return (
    <div className="flex flex-col gap-10">
      <LessonSubjectChips
        selectedSubject={selectedSubject}
        onClick={setSelectedSubject}
      />

      <LessonList selectedSubject={selectedSubject} />
    </div>
  );
}
