"use client";

import SubjectLayout from "@/components/subject-layout";
import { DataTable } from "@/components/table/data-table";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import FilterGRadeLevel from "@/components/table/filter-button/filter-grade-level";
import TableSkeleton from "@/components/table/table-skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Lesson } from "@/type/lesson";
import { ColumnDef } from "@tanstack/react-table";
import { useCallback } from "react";
import { toast } from "sonner";

import FilterBUttonLessonSubject from "@/components/table/filter-button/filter-button-lesson-subject";
import { useAddLessonsToGroup } from "@/hooks/mutations/group/use-add-lessons-to-group";
import useGetAllLessonsNotInGroup from "@/hooks/queries/lesson/use-get-all-lessons-not-in-group";

export default function GroupLessonManagementTable({
  groupId,
  setOpen,
}: {
  groupId: string;
  setOpen: (open: boolean) => void;
}) {
  const { data, isLoading } = useGetAllLessonsNotInGroup(groupId);
  const { mutateAsync: mutateAsyncAdd } = useAddLessonsToGroup();

  const handleValidate = useCallback(
    async (lessonIds: string | string[]) => {
      if (!Array.isArray(lessonIds)) lessonIds = [lessonIds];

      toast.promise(mutateAsyncAdd({ groupId, lessonIds }), {
        loading: "Ajout en cours...",
        success: (data) => data.success,
        error: (data) =>
          data.error ||
          "Une erreur c'est produite pendant l'ajout ! Veuillez réessayer.",
      });
      // Retarde la fermeture du modal de 1 seconde
      setTimeout(() => {
        setOpen(false);
      }, 1000);
    },
    [mutateAsyncAdd]
  );

  const columns: ColumnDef<Lesson>[] = [
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
      id: "Niveau",
      accessorKey: "gradeLevel",
      filterFn: "arrIncludesSome",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Niveau" />
      ),
      cell: ({ row }) => {
        const gradeLevel = row.original.gradeLevel;
        const color = row.original.gradeLevelColor;

        if (!gradeLevel) return null;
        return <SubjectLayout label={gradeLevel} color={color} />;
      },
    },
  ];

  if (isLoading) return <TableSkeleton />;

  return (
    <DataTable
      columns={columns}
      data={data ?? []}
      viewOptionsButton
      inputSearchColumnId="Titre"
      handleValidate={handleValidate}
    >
      {(table) => [
        <FilterBUttonLessonSubject table={table} />,
        <FilterGRadeLevel table={table} />,
      ]}
    </DataTable>
  );
}
