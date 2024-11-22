"use client";

import SubjectLayout from "@/components/subject-layout";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import useGetAllLessonsBySubject from "@/hooks/queries/use-get-all-lessons-by-subject";
import { Lesson } from "@/type/lesson";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { DataTable } from "../data-table";
import TableSkeleton from "../table-skeleton";

export default function LessonTable({ subject }: { subject: string }) {
  const { data: exerciceData, isLoading, isError, error } = useGetAllLessonsBySubject(subject);
  const router = useRouter();

  const hanldeDelete = (id: string) => {
    const res = confirm("Voulez-vous supprimer cet exercice ? " + id);
    if (res) {
      console.log("Suppression de l'exercice " + id);
    }
  };

  const columns: ColumnDef<Lesson>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "Titre",
      accessorKey: "title",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Titre" />,
    },
    {
      id: "Matière",
      accessorKey: "subject",
      filterFn: "arrIncludesSome",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Matière" />,
      cell: ({ row }) => {
        const subject = row.original.subject;
        const color = row.original.subjectColor;

        if (!subject) return null;
        return <SubjectLayout label={subject} color={color} />;
      },
    },
    {
      id: "Niveau",
      accessorKey: "gradeLevel",
      filterFn: "arrIncludesSome",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Niveau" />,
      cell: ({ row }) => {
        const gradeLevel = row.original.gradeLevel;
        const color = row.original.gradeLevelColor;

        if (!gradeLevel) return null;
        return <SubjectLayout label={gradeLevel} color={color} />;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const exercice = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* TODO: ajouter le bouton de modification d'exercice */}
              <DropdownMenuItem
                onClick={() => {
                  router.push(`/lesson/${exercice.slug}`);
                }}
              >
                Modifier
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* TODO: ajouter le bouton de suppression d'exercice */}
              <DropdownMenuItem className="text-red-500 focus:text-red-500 focus:bg-red-100" onClick={() => hanldeDelete(exercice.id)}>
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (isLoading) return <TableSkeleton />;

  return (
    <DataTable columns={columns} data={exerciceData ?? []} viewOptionsButton inputSearchColumnId="Titre">
      {/* {(table) => [<FilterBUttonLevel table={table} />, <FilterBUttonLessonSubject table={table} />]} */}
    </DataTable>
  );
}
