import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BookOpen } from "lucide-react";
import Link from "next/link";

/**
 * Lien vers la leçon d'un exercice. Le serveur ne fournit `lesson` que si la
 * leçon est attribuée au groupe de l'élève : sinon rien n'est affiché.
 */
export default function ReviewLessonLink({
  lesson,
  className,
}: {
  lesson?: { id: string; title: string } | null;
  className?: string;
}) {
  if (!lesson) return null;

  return (
    <Button asChild variant="outline" size="sm" className={cn("gap-2", className)}>
      <Link href={`/eleve/lecons/${lesson.id}`}>
        <BookOpen className="h-4 w-4" aria-hidden="true" />
        <span className="truncate">Revoir la leçon : {lesson.title}</span>
      </Link>
    </Button>
  );
}
