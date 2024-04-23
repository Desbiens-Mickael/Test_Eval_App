"use client";

import LevelLayout from "@/components/level-layout";
import SubjectLayout from "@/components/subject-layout";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { levelData, subjectData } from "./data";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Exercice = {
  id: string;
  lesson: string;
  title: string;
  level: string;
  subject: string;
  subjectColor: string;
};

export const columns: ColumnDef<Exercice>[] = [
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
      // const level = row.original.level;
      const level = levelData.find((level) => level.label === row.original.level);

      if (!level) return null;

      return <LevelLayout color={level.color} label={level.label} />;
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
      const subject = subjectData.find((subject) => subject.label === row.original.subject);

      if (!subject) return null;
      return <SubjectLayout label={subject.label} color={subject.color} />;
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

            <DropdownMenuItem onClick={() => console.log("Voir plus de l'exercice " + exercice.id)}>Voir plus</DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                console.log("Mise à jour de l'exercice " + exercice.id);
              }}
            >
              Modifier
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500 focus:text-red-500 focus:bg-red-100" onClick={() => console.log("Suppression de l'exercice " + exercice.id)}>
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
