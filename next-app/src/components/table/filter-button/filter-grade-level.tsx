"use client"

import SubjectLayout from "@/components/subject-layout";
import { Skeleton } from "@/components/ui/skeleton";
import useGetAllGradeLevels from "@/hooks/queries/use-get-all-grade-levels";
import { Table } from "@tanstack/react-table";
import DataTAbleBUttonFilter from "./data-table-button-filter";

interface FilterGRadeLevelProps<TData> {
  table: Table<TData>;
}

export default function FilterGRadeLevel<TData>({ table }: FilterGRadeLevelProps<TData>)  {
  const { isLoading, isError, data, error } = useGetAllGradeLevels();
  const column = table.getColumn("Niveau");

  if (isLoading) {
    return <Skeleton className="w-[80px] h-[32px]" />;
  }

  if (isError) {
    return;
  }

  if (data) return <DataTAbleBUttonFilter column={column} title="Niveau" templateComponent={SubjectLayout} data={data} />;
}
