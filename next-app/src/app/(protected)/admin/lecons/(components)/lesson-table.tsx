"use client";

import SubjectLayout from "@/components/subject-layout";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { useDeleteLessons } from "@/hooks/mutations/lesson/use-delete-lesson";
import useGetAllLessonsBySubject from "@/hooks/queries/lesson/use-get-all-lessons-by-subject";
import { Lesson } from "@/type/lesson";
import { ColumnDef } from "@tanstack/react-table";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { DataTable } from "../../../../../../components/table/data-table";
import FilterGRadeLevel from "../../../../../../components/table/filter-button/filter-grade-level";
import TableSkeleton from "../../../../../../components/table/table-skeleton";

import { DataTableRowActions } from "../../../../../../components/table/data-table-row-action";

export default function LessonTable({ subject }: { subject: string }) {
  const { data: exerciceData, isLoading } = useGetAllLessonsBySubject(subject);
  const { mutateAsync: mutateAsyncDelete, isPending } = useDeleteLessons();
  const [openId, setOpenId] = useState<string | null>(null);

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
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <DataTableRowActions
            elementId={row.original.id}
            handleDelete={handleDelete}
            editPath={`/admin/lecons/edition/${row.original.slug}`}
            openId={openId}
            setOpenId={setOpenId}
          />
        );
      },
    },
  ];

  if (isLoading) return <TableSkeleton />;

  return (
    <DataTable
      columns={columns}
      data={exerciceData ?? []}
      viewOptionsButton
      inputSearchColumnId="Titre"
      createLink="/admin/lecons/creation"
      handleDelete={handleDelete}
    >
      {(table) => [<FilterGRadeLevel table={table} />]}
    </DataTable>
  );
}