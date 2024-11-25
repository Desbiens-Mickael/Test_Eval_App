"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import parse from "html-react-parser";
import { JSONContent } from "novel";
import { JSONContentToHTML } from "../block-editor/extentions/extentions";

interface LessonContentProps {
  content: JSONContent | undefined;
  className?: string;
}


export default function LessonContent({ content, className }: LessonContentProps) {
  const contentHTML = JSONContentToHTML(content)
  return (
    <Dialog>
      <DialogTrigger asChild>
      <Button variant="secondary">Prévisualiser</Button>
        </DialogTrigger>
      <DialogContent className={`${className} max-w-screen-xl max-h-full lg:max-h-[90vh] overflow-auto`}>
        <DialogHeader>
          <DialogTitle className="">Visuel de votre leçon qui sera affiché aux apprenants.</DialogTitle>
        </DialogHeader>
        <article className="tiptap prose lg:prose-lg max-w-full rounded-xl border p-4">{parse(`${contentHTML}`)}</article>
      </DialogContent>
    </Dialog>
    );
}
