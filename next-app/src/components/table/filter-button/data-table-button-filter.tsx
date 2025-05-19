"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Column } from "@tanstack/react-table";
import { Filter } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

export type TemplateComponentProps = {
  label: string;
  color?: string;
  className?: string;
};

export interface DataTAbleBUttonFilterProps<TData, TValue> {
  column: Column<TData, TValue> | undefined;
  title: string;
  templateComponent: React.ElementType<TemplateComponentProps>;
  data: TemplateComponentProps[];
}

/**
 * Renders a filter button for a data table column.
 *
 * @param {DataTAbleBUttonFilterProps<TData, TValue>} props - The props object containing the following properties:
 *   - column: The column object for the filter button.
 *   - title: The title of the filter button.
 *   - data: The data array for the filter button.
 *   - templateComponent: The template component for the filter button.
 * @return {JSX.Element} The rendered filter button component.
 */
export default function DataTAbleBUttonFilter<TData, TValue>({
  column,
  title,
  data,
  templateComponent: TemplateComponent,
}: DataTAbleBUttonFilterProps<TData, TValue>) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filters = column?.getFilterValue() as string[] | undefined;
  const valuesofSelection = column?.getFacetedUniqueValues();
  const matchingFilter = useMemo(
    () =>
      data.filter((value) =>
        value.label.toLowerCase().includes(search.toLowerCase())
      ),
    [data, search]
  );

  const isChecked = useCallback(
    (columnId: string) => filters?.includes(columnId) ?? false,
    [filters]
  );

  const onResetfilterColumn = useCallback(() => {
    column?.setFilterValue(undefined);
  }, [column]);

  const handleFilter = useCallback(
    (value: string) => {
      const currentFilter = column?.getFilterValue() as string[] | undefined;
      const newFilter =
        currentFilter && currentFilter.includes(value)
          ? currentFilter.filter((item) => item !== value)
          : [...(currentFilter || []), value];
      column?.setFilterValue(newFilter);
    },
    [column]
  );

  return (
    <div className="flex items-center border border-dashed rounded-sm">
      <DropdownMenu open={open}>
        <DropdownMenuTrigger asChild>
          <Button
            title={`Filtrer par ${title}`}
            variant="ghost"
            className="h-8 px-2"
            onClick={() => setOpen(!open)}
          >
            <span className="sr-only">Open menu</span>
            <Filter className="h-4 w-4" />
            <span className="ml-2">{title}</span>
            {filters !== undefined && filters?.length > 0 && (
              <Separator orientation="vertical" className="mx-2 bg-secondary" />
            )}
            <div className="space-x-1">
              {filters !== undefined && filters.length > 2 ? (
                <Badge
                  variant={"secondary"}
                  className="rounded-sm"
                >{`${filters.length} filtres`}</Badge>
              ) : (
                filters?.map((value, index) => (
                  <Badge
                    variant={"secondary"}
                    key={index}
                    className="rounded-sm"
                  >
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
          {search.length ? (
            matchingFilter.length > 0 ? (
              matchingFilter.map((value, index) => {
                const label = value.label;
                const valueCount = valuesofSelection?.get(label) ?? 0;
                return (
                  <DropdownMenuCheckboxItem
                    slot="item"
                    key={index}
                    onCheckedChange={() => handleFilter(label)}
                    checked={isChecked(label)}
                    className={
                      "hover:bg-slate-100 data-[state=checked]:bg-slate-100 data-[state=checked]:text-slate-900"
                    }
                  >
                    <TemplateComponent label={label} color={value.color} />
                    <span className="ml-auto">{valueCount}</span>
                  </DropdownMenuCheckboxItem>
                );
              })
            ) : (
              <DropdownMenuItem className="text-slate-400">
                Aucun resultat
              </DropdownMenuItem>
            )
          ) : (
            data.map((value, index) => {
              const label = value.label;
              const valueCount = valuesofSelection?.get(label) ?? 0;
              return valueCount > 0 ? (
                <DropdownMenuCheckboxItem
                  slot="item"
                  key={index}
                  onCheckedChange={() => handleFilter(label)}
                  checked={isChecked(label)}
                  className={
                    "hover:bg-slate-100 data-[state=checked]:bg-slate-100 data-[state=checked]:text-slate-900"
                  }
                >
                  <TemplateComponent label={label} color={value.color} />
                  <span className="ml-auto">{valueCount}</span>
                </DropdownMenuCheckboxItem>
              ) : null;
            })
          )}
          {filters !== undefined && filters?.length > 0 && (
            <DropdownMenuItem className="text-slate-400">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => onResetfilterColumn()}
              >
                Reinitialiser
              </Button>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
