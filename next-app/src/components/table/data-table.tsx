"use client";

import { ColumnDef, ColumnFiltersState, SortingState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ListRestart } from "lucide-react";
import { useState } from "react";
import DataTAbleBUttonFilter from "./data-table-button-filter";
import DataTAbleDEleteSElectionButton from "./data-table-delete-selection-button";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableViewOptions } from "./data-table-view-options";

export interface Identifier {
  id: string;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterColumnIds?: string[];
  inputSearch?: boolean;
  viewOptionsButton?: boolean;
}

export function DataTable<TData extends Identifier, TValue>({ columns, data, filterColumnIds, inputSearch, viewOptionsButton }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getRowId(originalRow) {
      return originalRow.id;
    },
    defaultColumn: {
      size: 200, //starting column size
      minSize: 50, //enforced during column resizing
      maxSize: 500, //enforced during column resizing
    },
    state: {
      sorting,
      rowSelection,
      columnFilters,
    },
  });

  function onResetFilters() {
    table.resetColumnFilters();
    table.resetSorting();
    table.resetRowSelection();
    table.resetColumnVisibility();
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {inputSearch && (
            <Input
              placeholder="Filtrer par titre..."
              value={(table.getColumn("Titre")?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn("Titre")?.setFilterValue(event.target.value)}
              className="max-w-sm h-8"
            />
          )}

          {filterColumnIds && filterColumnIds.map((columnId) => <DataTAbleBUttonFilter key={columnId} table={table} title={columnId} columnId={columnId} />)}
        </div>
        <div className="flex items-center space-x-2">
          <DataTAbleDEleteSElectionButton table={table} />

          {viewOptionsButton && <DataTableViewOptions table={table} />}
          <Button title="Reinitialiser les filtres" variant="ghost" className="h-8 w-8 p-0 border" onClick={() => onResetFilters()}>
            <ListRestart />
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>;
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Aucun résultat.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
