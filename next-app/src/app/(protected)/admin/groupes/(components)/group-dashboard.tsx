"use client";

import { useGetAllGroups } from "@/hooks/queries/group/use-get-all-groups";
import EmptyState from "@/components/empty-state";
import { Users } from "lucide-react";
import CreateGroupButton from "./create-group-button";
import GroupCard from "./group-card";

export default function GroupDashboard() {
  const { data, isLoading, isError, error } = useGetAllGroups();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !data) {
    return <div>Error: {error?.message}</div>;
  }
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full flex justify-end">
        <CreateGroupButton />
      </div>
      <div>
        {data.length === 0 ? (
          <EmptyState
            icon={Users}
            className="rounded-xl border"
            title="Aucun groupe pour l'instant"
            description="Un groupe rassemble les élèves d'une classe ou d'un niveau. Créez-en un, puis ouvrez-le pour y ajouter des élèves et lui attribuer des leçons."
          >
            <CreateGroupButton label="Créer un groupe" />
          </EmptyState>
        ) : (
          <div className="w-full flex flex-wrap gap-4">
            {data.map((group) => (
              <GroupCard
                key={group.id}
                id={group.id}
                name={group.name}
                students={group.students}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
