"use client";

import SubjectLayout from "../../subject-layout";

import useGetAllLessonsSubject from "@/hooks/queries/use-get-all-lesson-subjects";
import { Column } from "@tanstack/react-table";
import DataTAbleBUttonFilter from "./data-table-button-filter";

interface FilterBUttonLessonSubjectProps<TData, TValue> {
  column: Column<TData, TValue> | undefined;
}

export default function FilterBUttonLessonSubject<TData, TValue>({ column }: FilterBUttonLessonSubjectProps<TData, TValue>) {
  const { isLoading, data, error } = useGetAllLessonsSubject();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (data) return <DataTAbleBUttonFilter column={column} title="Matière" templateComponent={SubjectLayout} data={data} />;
}
