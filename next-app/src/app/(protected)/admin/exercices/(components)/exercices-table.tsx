"use client";

// import { exerciceData } from "@/app/(protected)/admin/card-game/data";
import LevelLayout from "@/components/level-layout";
import SubjectLayout from "@/components/subject-layout";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useGetAllExercicesByType from "@/hooks/queries/exercice/use-get-all-exercices-by-type";
import { Exercice, ExerciceType } from "@/type/exercice";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DataTable } from "../../../../../components/table/data-table";
import FilterBUttonLessonSubject from "../../../../../components/table/filter-button/filter-button-lesson-subject";
import FilterBUttonLevel from "../../../../../components/table/filter-button/filter-button-level";
import TableSkeleton from "../../../../../components/table/table-skeleton";

export default function ExercicesTable({
  exerciceType,
}: {
  exerciceType: ExerciceType;
}) {
  const {
    data: exerciceData,
    isLoading,
    isError,
    error,
  } = useGetAllExercicesByType(exerciceType);

  const router = useRouter();

  const hanldeDelete = (id: string) => {
    const res = confirm("Voulez-vous supprimer cet exercice ? " + id);
    if (res) {
      console.log("Suppression de l'exercice " + id);
    }
  };

  const columns: ColumnDef<Exercice>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "Titre",
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Titre" />
      ),
    },
    {
      id: "Niveau",
      accessorKey: "level",
      filterFn: "arrIncludesSome",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Niveau" />
      ),
      cell: ({ row }) => {
        const level = row.original.level;
        const color = row.original.levelColor;

        return <LevelLayout color={color} label={level} />;
      },
    },
    {
      id: "Leçon",
      accessorKey: "lesson",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Leçon" />
      ),
    },
    {
      id: "Matière",
      accessorKey: "subject",
      filterFn: "arrIncludesSome",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Matière" />
      ),
      cell: ({ row }) => {
        const subject = row.original.subject;
        const color = row.original.subjectColor;

        if (!subject) return null;
        return <SubjectLayout label={subject} color={color} />;
      },
    },
    {
      id: "actions",
      header: "Actions",
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
                  router.push(`/admin/exercices/${exercice.id}/edition`);
                }}
              >
                Modifier
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* TODO: ajouter le bouton de suppression d'exercice */}
              <DropdownMenuItem
                className="text-red-500 focus:text-red-500 focus:bg-red-100"
                onClick={() => hanldeDelete(exercice.id)}
              >
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (isLoading) return <TableSkeleton />;

  if (isError) {
    toast.error(error.message);
    return (
      <DataTable
        columns={columns}
        data={exerciceData ?? []}
        viewOptionsButton
        inputSearchColumnId="Titre"
        handleDelete={async () => {
          console.log("Suppression de l'exercice");
        }}
      />
    );
  }

  return (
    <DataTable
      columns={columns}
      data={exerciceData ?? []}
      viewOptionsButton
      inputSearchColumnId="Titre"
      // createLink="/admin/exercices/creation"
      handleDelete={async () => {
        console.log("Suppression de l'exercice");
      }}
    >
      {(table) => [
        <FilterBUttonLevel table={table} />,
        <FilterBUttonLessonSubject table={table} />,
      ]}
    </DataTable>
  );
}
