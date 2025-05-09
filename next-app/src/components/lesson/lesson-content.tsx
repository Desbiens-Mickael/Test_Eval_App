"use client";

import { JSONContentToHTML } from "@/components/block-editor/extentions/extentions";
import parse from "html-react-parser";
import Image from "next/image";
import { JSONContent } from "novel";
interface ShowLessonProps {
  imageBanner?: string;
  content: JSONContent | undefined;
}

export default function LessonContent({
  imageBanner,
  content,
}: ShowLessonProps) {
  const contentHTML = JSONContentToHTML(content);

  return (
    <div>
      {imageBanner && (
        <Image
          src={imageBanner}
          alt="image banner"
          width={1920}
          height={1080}
          className="w-full h-[300px] object-cover rounded-xl"
        />
      )}
      <article className="tiptap prose lg:prose-lg max-w-full rounded-xl border p-4">
        {parse(`${contentHTML}`)}
      </article>
    </div>
  );
}
