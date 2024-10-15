"use client";

import { Input } from "@/components/ui/input";
import { Table } from "@tanstack/react-table";

interface DataTAbleInputFilterProps<TData> {
  table: Table<TData>;
  columnId: string;
}

/**
 * Renders an input filter component for a given column in a table.
 *
 * @param {DataTAbleInputFilterProps<TData>} props - The props object containing the table and columnId.
 * @param {Table<TData>} props.table - The table object.
 * @param {string} props.columnId - The ID of the column to filter.
 * @return {JSX.Element} The rendered input filter component.
 */
export default function DataTAbleInputFilter<TData>({ table, columnId }: DataTAbleInputFilterProps<TData>) {
  return (
    <Input
      placeholder={`Filtrer par ${columnId.toLocaleLowerCase()}...`}
      value={(table.getColumn(columnId)?.getFilterValue() as string) ?? ""}
      onChange={(event) => table.getColumn(columnId)?.setFilterValue(event.target.value)}
      className="max-w-sm h-8"
    />
  );
}
