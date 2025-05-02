"use client";

import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface LessonDashboardItemProps {
  lessonTitle: string;
  lessonId: string;
}

const LessonDashboardItem = ({
  lessonTitle,
  lessonId,
}: LessonDashboardItemProps) => {
  return (
    <Card className="flex flex-col justify-between">
      <CardHeader>
        <CardTitle>{lessonTitle}</CardTitle>
      </CardHeader>
      <CardFooter>
        <Button asChild className="w-full mt-4">
          <Link href={`/eleve/lecons/${lessonId}`}>Démarrer</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LessonDashboardItem;
