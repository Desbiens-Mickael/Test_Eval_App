"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  Table,
  useReactTable,
} from "@tanstack/react-table";

import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table as TableUI,
} from "@/components/ui/table";
import { ReactElement, useState } from "react";
import DataTAbleBUttonCreate from "./data-table-button-create";
import DataTableButtonReset from "./data-table-button-reset";
import DataTableDeleteSelectionButton from "./data-table-delete-selection-button";
import DataTAbleInputFilter from "./data-table-input-filter";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableViewOptions } from "./data-table-view-options";

export interface Identifier {
  id: string;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  inputSearchColumnId?: string;
  viewOptionsButton?: boolean;
  createLink?: string;
  createChildren?: React.ReactNode;
  handleDelete: (ids: string[]) => Promise<void>;
  children?: (table: Table<TData>) => ReactElement[];
}

/**
 * Renders a DataExerciceTable component with the given data and columns.
 *
 * @param {DataTableProps<TData, TValue>} props - The props object containing the data, columns, filterColumnIds, inputSearchColumnId, and viewOptionsButton.
 * @param {TData[]} props.data - The array of data to be displayed in the table.
 * @param {ColumnDef<TData, TValue>[]} props.columns - The array of column definitions for the table.
 * @param {boolean} [props.viewOptionsButton] - A boolean indicating whether to display the view options button.
 * @param {string} [props.inputSearchColumnId] - The id of the column to use for the input search.
 * @param {ReactElement<{ table: Table<TData> }> | ReactElement<{ table: Table<TData> }>[]} [props.children] - The children components to be rendered within the table. If not provided, a default filter button will be rendered.
 * @return {JSX.Element} The rendered DataTable component.
 */
export function DataTable<TData extends Identifier, TValue>({
  columns,
  data,
  inputSearchColumnId,
  viewOptionsButton,
  createLink,
  handleDelete,
  children,
  createChildren,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
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
          {inputSearchColumnId && (
            <DataTAbleInputFilter
              key={"Titre"}
              table={table}
              columnId={inputSearchColumnId}
            />
          )}
          {children &&
            children(table).map((child, index) => (
              <div key={index}>{child}</div>
            ))}
        </div>
        <div className="flex items-center space-x-2">
          <DataTableDeleteSelectionButton
            handleDelete={handleDelete}
            table={table}
          />
          {createLink && <DataTAbleBUttonCreate createLink={createLink} />}
          {createChildren && <>{createChildren}</>}
          {viewOptionsButton && <DataTableViewOptions table={table} />}
          <DataTableButtonReset table={table} />
        </div>
      </div>
      <div className="rounded-md border">
        <TableUI>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-2xl font-bold"
                >
                  Aucun résultat trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </TableUI>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
