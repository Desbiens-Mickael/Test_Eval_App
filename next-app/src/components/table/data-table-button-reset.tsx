"use client";

import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
import { ListRestart } from "lucide-react";

interface DataTAbleButtonResetProps<TData> {
  table: Table<TData>;
}

/**
 * Resets the filters, sorting, row selection, and column visibility of a table.
 *
 * @param {DataTAbleButtonResetProps<TData>} props - The props object containing the table to reset.
 * @return {JSX.Element} The button component for resetting the table.
 */
export default function DataTAbleButtonReset<TData>({ table }: DataTAbleButtonResetProps<TData>) {
  function onResetFilters() {
    table.resetColumnFilters();
    table.resetSorting();
    table.resetRowSelection();
    table.resetColumnVisibility();
  }

  return (
    <Button title="Reinitialiser les filtres" variant="ghost" className="h-8 w-8 p-0 border" onClick={() => onResetFilters()}>
      <ListRestart />
    </Button>
  );
}
