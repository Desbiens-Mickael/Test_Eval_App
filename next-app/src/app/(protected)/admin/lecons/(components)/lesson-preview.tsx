"use client";

import LessonContent from "@/components/lesson/lesson-content";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { JSONContent } from "novel";

interface LessonContentProps {
  imageBanner?: string;
  content: JSONContent | undefined;
  className?: string;
}

export default function LessonPreview({
  content,
  imageBanner,
  className,
}: LessonContentProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Prévisualiser</Button>
      </DialogTrigger>
      <DialogContent
        className={`${className} max-w-screen-xl max-h-full lg:max-h-[90vh] overflow-auto`}
      >
        <DialogHeader>
          <DialogTitle className="">
            Visuel de votre leçon qui sera affiché aux élèves.
          </DialogTitle>
        </DialogHeader>
        <LessonContent content={content} imageBanner={imageBanner} />
      </DialogContent>
    </Dialog>
  );
}
