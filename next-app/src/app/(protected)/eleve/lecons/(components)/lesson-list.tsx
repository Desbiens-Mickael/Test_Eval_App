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

const LessonListSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {[...Array(4)].map((_, index) => (
        <Card
          key={index}
          className="relative w-full flex flex-col justify-between overflow-hidden animate-pulse"
        >
          <CardHeader className="p-0">
            <div className="w-full h-[150px] bg-gray-300" />
            <div className="absolute top-1 left-1 bg-gray-200 px-2 py-1 rounded-full" />
          </CardHeader>
          <CardContent className="flex justify-center items-center p-2">
            <div className="h-6 w-3/4 bg-gray-300 rounded" />
          </CardContent>
          <CardFooter className="p-2">
            <div className="w-full h-10 bg-gray-300 rounded" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

const LessonList = ({ selectedSubject }: LessonListProps) => {
  const { data, isLoading, isError } = useGetAllLessonsForStudent({
    subject: selectedSubject,
  });

  if (isLoading) return <LessonListSkeleton />;

  if (isError)
    throw new Error(
      "Une erreur est survenue lors de la récupération des leçons"
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
              src={lesson.imageBanner || "/assets/images/img-placeholder.png"}
              alt={lesson.title}
              priority
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
