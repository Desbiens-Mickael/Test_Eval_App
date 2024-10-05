"use client";

// import { exerciceData } from "@/app/(protected)/admin/card-game/data";
import LevelLayout from "@/components/level-layout";
import Loader from "@/components/loader";
import SubjectLayout from "@/components/subject-layout";
import { DataTable } from "@/components/table/data-table";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import useGetAllExerciceLevels from "@/hooks/queries/use-get-all-exercice-levels";
import useGetAllLessonsSubject from "@/hooks/queries/use-get-all-lesson-subjects";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Exercice = {
  id: string;
  lesson: string;
  title: string;
  level: string;
  subject: string;
};

export default function ExercicesTable({ exerciceData }: { exerciceData: Exercice[] }) {
  const { data: subjectData, isLoading: isLoadingSubjectData } = useGetAllLessonsSubject();
  const { data: levelData, isLoading: isLoadingLevelData } = useGetAllExerciceLevels();
  const filterColumnIds = ["Matière", "Niveau"];
  const inputSearchColumnId = ["Titre"];

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
        // const level = row.original.level;
        const level = levelData?.find((level) => level.label === row.original.level);

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
        const subject = subjectData?.find((subject) => subject.label === row.original.subject);

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

  if (isLoadingSubjectData || isLoadingLevelData) return <Loader />;

  return <DataTable columns={columns} data={exerciceData} filterColumnIds={filterColumnIds} inputSearchColumnId={inputSearchColumnId} viewOptionsButton />;
}
