"use client";

import { JSONContentToHTML } from "@/components/block-editor/extentions/extentions";
import parse from "html-react-parser";
import { JSONContent } from "novel";
interface ShowLessonProps {
  content: JSONContent | undefined;
}

export default function LessonContent({ content }: ShowLessonProps) {
  const contentHTML = JSONContentToHTML(content);

  return (
    <div>
      <article className="tiptap prose lg:prose-lg max-w-full rounded-xl border p-4">
        {parse(`${contentHTML}`)}
      </article>
    </div>
  );
}
