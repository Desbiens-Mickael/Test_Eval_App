"use client";

import LevelLayout from "../../level-layout";

import { Skeleton } from "@/components/ui/skeleton";
import useGetAllExerciceLevels from "@/hooks/queries/use-get-all-exercice-levels";
import { Table } from "@tanstack/react-table";
import DataTAbleBUttonFilter from "./data-table-button-filter";

interface FilterBUttonLevelProps<TData> {
  table: Table<TData>;
}

export default function FilterBUttonLevel<TData>({ table }: FilterBUttonLevelProps<TData>) {
  const { isLoading, isError, data, error } = useGetAllExerciceLevels();
  const column = table.getColumn("Niveau");

  if (isLoading) {
    return <Skeleton className="w-[80px] h-[32px]" />;
  }

  if (isError) {
    return;
  }

  if (data) return <DataTAbleBUttonFilter column={column} title="Niveau" templateComponent={LevelLayout} data={data} />;
}
