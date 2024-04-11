"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table } from "@tanstack/react-table";
import { Filter } from "lucide-react";

interface DataTAbleBUttonFilterProps<TData> {
  table: Table<TData>;
  title: string;
  columnId: string;
  Values: string[];
}

export default function DataTAbleBUttonFilter<TData>({ table, title, columnId, Values }: DataTAbleBUttonFilterProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button title={`Filtrer par ${title}`} variant="ghost" className="border border-dashed">
          <span className="sr-only">Open menu</span>
          <Filter className="h-4 w-4" />
          <span className="ml-2">{title}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Filtrer</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {Values.map((value) => (
          <DropdownMenuItem key={value} onClick={() => table.getColumn(columnId)?.setFilterValue(value)}>
            {value}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
