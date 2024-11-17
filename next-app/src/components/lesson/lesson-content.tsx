"use client";

import parse from "html-react-parser";

export default function LessonContent({ codeString }: { codeString: string | null | undefined }) {
  return <div className="tiptap prose lg:prose-xl">{parse(`${codeString}`)}</div>;
}
