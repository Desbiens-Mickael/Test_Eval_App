"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Table } from "@tanstack/react-table";
import { Filter } from "lucide-react";
import { useCallback, useState } from "react";

interface DataTAbleBUttonFilterProps<TData> {
  table: Table<TData>;
  title: string;
  columnId: string;
}

export default function DataTAbleBUttonFilter<TData>({ table, title, columnId }: DataTAbleBUttonFilterProps<TData>) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const column = table.getColumn(columnId);
  const filters = column?.getFilterValue() as string[] | undefined;
  const valuesofSelection: string[] = Array.from(new Set(column?.getFacetedRowModel().rows.map((row) => row.getValue(columnId))));
  const isChecked = useCallback((title: string) => filters?.includes(title) ?? false, [filters]);

  const onResetfilterColumn = useCallback(() => {
    column?.setFilterValue(undefined);
  }, [column]);

  const handleFilter = useCallback(
    (value: string) => {
      const currentFilter = column?.getFilterValue() as string[] | undefined;
      const newFilter = currentFilter && currentFilter.includes(value) ? currentFilter.filter((item) => item !== value) : [...(currentFilter || []), value];
      column?.setFilterValue(newFilter);
    },
    [column]
  );

  return (
    <div className="flex items-center border border-dashed rounded-sm group hover:bg-secondary">
      <DropdownMenu open={open}>
        <DropdownMenuTrigger asChild>
          <Button title={`Filtrer par ${title}`} variant="ghost" className="h-8 px-2" onClick={() => setOpen(!open)}>
            <span className="sr-only">Open menu</span>
            <Filter className="h-4 w-4" />
            <span className="ml-2">{title}</span>
            {filters !== undefined && filters?.length > 0 && <Separator orientation="vertical" className="mx-2 bg-secondary" />}
            <div className="space-x-1">
              {filters !== undefined && filters.length > 2 ? (
                <Badge variant={"secondary"} className="rounded-sm">{`${filters.length} filtres`}</Badge>
              ) : (
                filters?.map((value, index) => (
                  <Badge variant={"secondary"} key={index} className="rounded-sm">
                    {value}
                  </Badge>
                ))
              )}
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          onPointerDownOutside={() => {
            setOpen(false);
            setSearch("");
          }}
        >
          <DropdownMenuItem>
            <Input
              autoFocus
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              placeholder={`Filtrer par ${title}`}
            />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {search
            ? valuesofSelection
                .filter((value) => value.toLowerCase().includes(search.toLowerCase()))
                .map((value, index) => (
                  <DropdownMenuCheckboxItem
                    slot="item"
                    key={index}
                    onCheckedChange={() => handleFilter(value)}
                    checked={isChecked(value)}
                    className={"hover:bg-slate-100 data-[state=checked]:bg-slate-100 data-[state=checked]:text-slate-900"}
                  >
                    {value}
                  </DropdownMenuCheckboxItem>
                ))
            : valuesofSelection.map((value, index) => (
                <DropdownMenuCheckboxItem
                  key={index}
                  onCheckedChange={() => handleFilter(value)}
                  checked={isChecked(value)}
                  className={"hover:bg-slate-100 data-[state=checked]:bg-slate-100 data-[state=checked]:text-slate-900"}
                >
                  {value}
                </DropdownMenuCheckboxItem>
              ))}
          {filters !== undefined && filters?.length > 0 && (
            <DropdownMenuItem className="text-slate-400">
              <Button variant="outline" className="w-full" onClick={() => onResetfilterColumn()}>
                Reinitialiser
              </Button>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
