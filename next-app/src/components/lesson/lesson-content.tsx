"use client";

import { JSONContentToHTML } from "@/components/block-editor/extentions/extentions";
import { ShowLessonType } from "@/type/lesson";
import parse from "html-react-parser";
import Image from "next/image";
import SubjectLayout from "../subject-layout";
import { Card, CardContent } from "../ui/card";
interface ShowLessonProps extends ShowLessonType {}

export default function LessonContent({
  imageBanner,
  title,
  subject,
  subjectColor,
  gradeLevel,
  gradeLevelColor,
  content,
}: ShowLessonProps) {
  const contentHTML = JSONContentToHTML(content);

  return (
    <Card className="overflow-hidden border-border/20 dark:border-border/100">
      <div className="relative h-56 bg-gradient-to-br from-primary/20 via-primary/5 to-secondary/20">
        {imageBanner && (
          <div className="absolute inset-0 w-full h-full">
            <Image
              src={imageBanner}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/30 via-transparent to-background/30" />
          </div>
        )}
        <div className="relative h-full flex flex-col justify-end p-6">
          <div className="flex items-center gap-2 mb-2">
            {subject && (
              <SubjectLayout
                label={subject}
                color={subjectColor}
                className="border border-border/20"
              />
            )}
            {gradeLevel && (
              <SubjectLayout
                label={gradeLevel}
                color={gradeLevelColor}
                className="border border-border/20"
              />
            )}
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        </div>
      </div>

      <CardContent className="pt-8">
        <article className="tiptap prose dark:prose-invert lg:prose-lg max-w-full rounded-xl border p-4">
          {parse(`${contentHTML}`)}
        </article>
      </CardContent>
    </Card>
  );
}
