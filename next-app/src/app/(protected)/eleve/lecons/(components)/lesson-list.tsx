"use client";

import SubjectLayout from "@/components/subject-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useGetAllLessonsForStudent from "@/hooks/queries/lesson/use-get-all-lessons-for-student";
import Image from "next/image";
import Link from "next/link";

interface LessonListProps {
  selectedSubject: string | undefined;
}

const LessonList = ({ selectedSubject }: LessonListProps) => {
  const { data, isLoading, isError } = useGetAllLessonsForStudent({
    subject: selectedSubject,
  });

  if (isLoading) return <div></div>;
  if (isError)
    return (
      <div>
        <Card className="w-full flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-center text-lg">Erreur</CardTitle>
          </CardHeader>
          <CardContent>
            <SubjectLayout label={"Erreur"} color={"red"} />
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full mt-4">
              <Link href={`/eleve/lecons`}>Démarrer</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {data?.map((lesson) => (
        <Card
          className="relative w-full flex flex-col justify-between overflow-hidden"
          key={lesson.id}
        >
          <CardHeader className="p-0">
            <Image
              src={"/assets/images/img-placeholder.png"}
              alt={lesson.title}
              className="w-auto h-[150px] object-cover"
              width={200}
              height={100}
            />
            <SubjectLayout
              className="absolute top-0 left-1"
              label={lesson.subject}
              color={lesson.subjectColor}
            />
          </CardHeader>
          <CardContent className="flex justify-center items-center p-2">
            <CardTitle className="text-center text-lg">
              {lesson.title}
            </CardTitle>
          </CardContent>
          <CardFooter className="p-2">
            <Button asChild className="w-full">
              <Link href={`/eleve/lecons/${lesson.id}`}>Démarrer</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default LessonList;
