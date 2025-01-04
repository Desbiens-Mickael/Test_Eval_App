"use client";

// import { exerciceData } from "@/app/(protected)/admin/card-game/data";
import LevelLayout from "@/components/level-layout";
import SubjectLayout from "@/components/subject-layout";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { DataTableRowActions } from "@/components/table/data-table-row-action";
import { Checkbox } from "@/components/ui/checkbox";
import { useDeleteExercices } from "@/hooks/mutations/exercice/use-delete-exercice";
import useGetAllExercicesByType from "@/hooks/queries/exercice/use-get-all-exercices-by-type";
import { Exercice, ExerciceType } from "@/type/exercice";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
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

  const { mutateAsync: mutateAsyncDelete, isPending } = useDeleteExercices();
  const [openId, setOpenId] = useState<string | null>(null);

  const router = useRouter();

  const handleDelete = useCallback(
    async (lessonIds: string | string[]) => {
      if (!Array.isArray(lessonIds)) lessonIds = [lessonIds];

      toast.promise(mutateAsyncDelete(lessonIds), {
        loading: "Suppression en cours...",
        success: (data) => data.success,
        error: (data) =>
          data.error ||
          "Une erreur c'est produite pendant la suppression ! Veuillez réessayer.",
      });
    },
    [mutateAsyncDelete]
  );

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
          <DataTableRowActions
            elementId={row.original.id}
            handleDelete={handleDelete}
            editPath={`/admin/exercices/${exercice.id}/edition`}
            openId={openId}
            setOpenId={setOpenId}
          ></DataTableRowActions>
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
      handleDelete={handleDelete}
    >
      {(table) => [
        <FilterBUttonLevel table={table} />,
        <FilterBUttonLessonSubject table={table} />,
      ]}
    </DataTable>
  );
}
