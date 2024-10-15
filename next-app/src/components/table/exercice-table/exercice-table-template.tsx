"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import DataTableButtonReset from "../data-table-button-reset";
import DataTableDEleteSElectionButton from "../data-table-delete-selection-button";
import DataTAbleInputFilter from "../data-table-input-filter";
import { DataTablePagination } from "../data-table-pagination";
import { DataTableViewOptions } from "../data-table-view-options";
import FilterBUttonLessonSubject from "../filter-button/filter-button-lesson-subject";
import FilterBUttonLevel from "../filter-button/filter-button-level";

export interface Identifier {
  id: string;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterColumnIds?: string[];
  inputSearchColumnId?: string[];
  viewOptionsButton?: boolean;
}

/**
 * Renders a DataExerciceTable component with the given data and columns.
 *
 * @param {DataTableProps<TData, TValue>} props - The props object containing the data, columns, filterColumnIds, inputSearchColumnId, and viewOptionsButton.
 * @param {TData[]} props.data - The array of data to be displayed in the table.
 * @param {ColumnDef<TData, TValue>[]} props.columns - The array of column definitions for the table.
 * @param {boolean} [props.viewOptionsButton] - A boolean indicating whether to display the view options button.
 * @return {JSX.Element} The rendered DataTable component.
 */
export function ExerciceTableTemplate<TData extends Identifier, TValue>({ columns, data, viewOptionsButton }: DataTableProps<TData, TValue>) {
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
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedRowModel: getFacetedRowModel(),
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

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <DataTAbleInputFilter key={"Titre"} table={table} columnId={"Titre"} />

          <FilterBUttonLevel column={table.getColumn("Niveau")} />
          <FilterBUttonLessonSubject column={table.getColumn("Matière")} />
        </div>
        <div className="flex items-center space-x-2">
          <DataTableDEleteSElectionButton table={table} />
          {viewOptionsButton && <DataTableViewOptions table={table} />}
          <DataTableButtonReset table={table} />
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
                <TableCell colSpan={columns.length} className="h-24 text-center text-2xl font-bold">
                  Aucun résultat trouvé.
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
