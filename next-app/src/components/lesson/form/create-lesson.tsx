"use client";

import NovelEditor from "@/components/block-editor/novel-editor";
import { useState } from "react";
import LessonContent from "../lesson-content";

export default function CreateLesson() {
  const [content, setContent] = useState<string>("");

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="w-full">
        <NovelEditor onChange={setContent} />
        <LessonContent codeString={content} />
      </div>
    </div>
  );
}
