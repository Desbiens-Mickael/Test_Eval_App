"use client";

import { Lesson } from "@/type/lesson";

interface LessonListeProps {
  lessons: Lesson[];
}

export default function LessonListe({ lessons }: LessonListeProps) {
  return (
    <div className="flex flex-col gap-2 py-2">
      {lessons.length === 0 ? (
        <h3 className="text-xl font-bold text-center">Aucune leçon</h3>
      ) : (
        lessons.map((lesson) => (
          <div
            key={lesson.id}
            className="flex justify-between items-center bg-gray-600 rounded-md p-2"
          >
            <h3 className="text-md font-bold text-background">
              {lesson.title}
            </h3>
            <h3 className="text-md font-bold text-background">
              {lesson.subject}
            </h3>
          </div>
        ))
      )}
    </div>
  );
}
