"use client";

// import { exerciceData } from "@/app/(protected)/admin/card-game/data";
import LevelLayout from "@/components/level-layout";
import SubjectLayout from "@/components/subject-layout";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import useGetAllExercicesByType from "@/hooks/queries/use-get-all-exercices-by-type";
import { Exercice } from "@/type/exercice";
import { ExerciceType } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import TableSkeleton from "../table-skeleton";
import { ExerciceTableTemplate } from "./exercice-table-template";

export default function ExercicesTable({ exerciceType }: { exerciceType: ExerciceType }) {
  const { data: exerciceData, isLoading, isError, error } = useGetAllExercicesByType(exerciceType);

  const columns: ColumnDef<Exercice>[] = [
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
      id: "Niveau",
      accessorKey: "level",
      filterFn: "arrIncludesSome",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Niveau" />,
      cell: ({ row }) => {
        const level = row.original.level;
        const color = row.original.levelColor;

        return <LevelLayout color={color} label={level} />;
      },
    },
    {
      id: "Leçon",
      accessorKey: "lesson",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Leçon" />,
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
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              {/* TODO: ajouter le bouton de modification d'exercice */}
              <DropdownMenuItem
                onClick={() => {
                  console.log("Mise à jour de l'exercice " + exercice.id);
                }}
              >
                Modifier
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* TODO: ajouter le bouton de suppression d'exercice */}
              <DropdownMenuItem className="text-red-500 focus:text-red-500 focus:bg-red-100" onClick={() => console.log("Suppression de l'exercice " + exercice.id)}>
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (isLoading) return <TableSkeleton />;

  return <ExerciceTableTemplate columns={columns} data={exerciceData ?? []} viewOptionsButton />;
}
