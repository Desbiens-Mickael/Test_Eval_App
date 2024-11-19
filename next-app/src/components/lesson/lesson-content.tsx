"use client";

import parse from "html-react-parser";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface LessonContentProps {
  content: string | null | undefined;
  className?: string;
}

export default function LessonContent({ content, className }: LessonContentProps) {
  return (
    <Dialog>
      <DialogTrigger>
      <Button variant="secondary">Prévisualiser</Button>
        </DialogTrigger>
      <DialogContent className={`${className} max-w-screen-xl max-h-full lg:max-h-[90vh] overflow-auto`}>
        <DialogHeader>
          <DialogTitle className="">Visuel de votre leçon qui sera affiché sur la page de votre leçon.</DialogTitle>
        </DialogHeader>
        <article className="tiptap prose lg:prose-lg max-w-full rounded-xl border p-4">{parse(`${content}`)}</article>
      </DialogContent>
    </Dialog>
    );
}
