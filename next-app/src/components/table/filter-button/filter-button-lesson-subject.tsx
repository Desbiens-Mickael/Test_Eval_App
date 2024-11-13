"use client";

import SubjectLayout from "../../subject-layout";

import { Skeleton } from "@/components/ui/skeleton";
import useGetAllLessonsSubject from "@/hooks/queries/use-get-all-lesson-subjects";
import { Table } from "@tanstack/react-table";
import DataTAbleBUttonFilter from "./data-table-button-filter";

interface FilterBUttonLessonSubjectProps<TData> {
  table: Table<TData>;
}

export default function FilterBUttonLessonSubject<TData>({ table }: FilterBUttonLessonSubjectProps<TData>) {
  const { isLoading, data, isError } = useGetAllLessonsSubject();
  const column = table.getColumn("Matière");

  if (isLoading) {
    return <Skeleton className="w-[80px] h-[32px]" />;
  }

  if (isError) {
    return;
  }

  if (data) return <DataTAbleBUttonFilter column={column} title="Matière" templateComponent={SubjectLayout} data={data} />;
}
