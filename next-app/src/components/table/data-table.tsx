"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  OnChangeFn,
  PaginationState,
  RowData,
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
import { ReactElement, useEffect, useState } from "react";
import DataTAbleBUttonCreate from "./data-table-button-create";
import DataTableButtonReset from "./data-table-button-reset";
import DataTableDeleteSelectionButton from "./data-table-delete-selection-button";
import DataTAbleInputFilter from "./data-table-input-filter";
import { DataTablePagination } from "./data-table-pagination";
import DataTableValidateSelectionButton from "./data-table-validate-selection-button";
import { DataTableViewOptions } from "./data-table-view-options";

export interface Identifier {
  id: string;
}

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    /** Mode serveur : nombre d'éléments par valeur de filtre, par colonne */
    facets?: Record<string, Record<string, number>>;
  }
}

/**
 * Mode serveur : le tableau n'affiche qu'une page ; la pagination, le tri et
 * les filtres sont envoyés au serveur (voir `useServerTable`).
 */
export interface ServerTableOptions {
  /** Nombre total d'éléments correspondant aux filtres */
  rowCount: number;
  state: {
    pagination: PaginationState;
    sorting: SortingState;
    columnFilters: ColumnFiltersState;
  };
  onPaginationChange: OnChangeFn<PaginationState>;
  onSortingChange: OnChangeFn<SortingState>;
  onColumnFiltersChange: OnChangeFn<ColumnFiltersState>;
  facets?: Record<string, Record<string, number>>;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  inputSearchColumnId?: string;
  viewOptionsButton?: boolean;
  createLink?: string;
  createChildren?: React.ReactNode;
  handleDelete?: (ids: string[]) => Promise<void>;
  handleValidate?: (ids: string[]) => Promise<void>;
  children?: (table: Table<TData>) => ReactElement[];
  server?: ServerTableOptions;
  /** Affiché à la place du tableau vide tant qu'aucun filtre n'est actif */
  emptyState?: React.ReactNode;
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
  handleValidate,
  children,
  createChildren,
  server,
  emptyState,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const serverStateKey = server ? JSON.stringify(server.state) : "";

  // Mode serveur : la sélection ne porte que sur la page affichée ; on la vide
  // dès que la page, le tri ou les filtres changent, pour ne jamais agir sur
  // des lignes que l'on ne voit plus
  useEffect(() => {
    if (server) setRowSelection({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverStateKey]);

  const table = useReactTable<TData>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    ...(server
      ? {
          manualPagination: true,
          manualSorting: true,
          manualFiltering: true,
          rowCount: server.rowCount,
          onPaginationChange: server.onPaginationChange,
          onSortingChange: server.onSortingChange,
          onColumnFiltersChange: server.onColumnFiltersChange,
          meta: { facets: server.facets },
        }
      : {
          getPaginationRowModel: getPaginationRowModel(),
          onSortingChange: setSorting,
          getSortedRowModel: getSortedRowModel(),
          onColumnFiltersChange: setColumnFilters,
          getFilteredRowModel: getFilteredRowModel(),
          getFacetedUniqueValues: getFacetedUniqueValues(),
          getFacetedRowModel: getFacetedRowModel(),
        }),
    getRowId(originalRow) {
      return originalRow.id;
    },
    defaultColumn: {
      size: 200, //starting column size
      minSize: 50, //enforced during column resizing
      maxSize: 500, //enforced during column resizing
    },
    state: server
      ? { ...server.state, rowSelection }
      : {
          sorting,
          rowSelection,
          columnFilters,
        },
  });

  // Liste vraiment vide (pas un filtre sans résultat) : on explique quoi faire
  const isFiltered = table.getState().columnFilters.length > 0;
  const showEmptyState =
    !!emptyState &&
    !isFiltered &&
    (server ? server.rowCount === 0 : data.length === 0);

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
          {handleDelete && (
            <DataTableDeleteSelectionButton
              handleDelete={handleDelete}
              table={table}
            />
          )}
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
                  className={
                    showEmptyState ? "p-0" : "h-24 text-center text-2xl font-bold"
                  }
                >
                  {showEmptyState ? emptyState : "Aucun résultat trouvé."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </TableUI>
      </div>
      <div className="flex flex-col space-y-2">
        <DataTablePagination table={table} />
        {handleValidate && (
          <DataTableValidateSelectionButton
            table={table}
            handleValidate={handleValidate}
          />
        )}
      </div>
    </div>
  );
}
