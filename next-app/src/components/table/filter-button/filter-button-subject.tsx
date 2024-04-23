"use client";

import SubjectLayout from "../../subject-layout";

import { subjectData } from "@/app/(protected)/admin/card-game/data";
import { Column } from "@tanstack/react-table";
import DataTAbleBUttonFilter from "../data-table-button-filter";

interface FilterBUttonSubjectProps<TData, TValue> {
  column: Column<TData, TValue> | undefined;
}

export default function FilterBUttonSubject<TData, TValue>({ column }: FilterBUttonSubjectProps<TData, TValue>) {
  return <DataTAbleBUttonFilter column={column} title="Matière" templateComponent={SubjectLayout} data={subjectData} />;
}
