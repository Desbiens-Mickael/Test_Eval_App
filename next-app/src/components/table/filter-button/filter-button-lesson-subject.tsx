"use client";

import SubjectLayout from "../../subject-layout";

import { Skeleton } from "@/components/ui/skeleton";
import useGetAllLessonsSubject from "@/hooks/queries/use-get-all-lesson-subjects";
import { Column } from "@tanstack/react-table";
import DataTAbleBUttonFilter from "./data-table-button-filter";

interface FilterBUttonLessonSubjectProps<TData, TValue> {
  column: Column<TData, TValue> | undefined;
}

export default function FilterBUttonLessonSubject<TData, TValue>({ column }: FilterBUttonLessonSubjectProps<TData, TValue>) {
  const { isLoading, data, isError } = useGetAllLessonsSubject();

  if (isLoading) {
    return <Skeleton className="w-[80px] h-[32px]" />;
  }

  if (isError) {
    return;
  }

  if (data) return <DataTAbleBUttonFilter column={column} title="Matière" templateComponent={SubjectLayout} data={data} />;
}
