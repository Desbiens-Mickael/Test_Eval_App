"use client";

import { useGetAllGroups } from "@/hooks/queries/group/use-get-all-groups";
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
          <div className="w-full flex justify-center items-center">
            <p className="text-center">Aucun groupe disponible</p>
          </div>
        ) : (
          <div className="w-full flex flex-wrap gap-4">
            {data.map((group) => (
              <GroupCard
                key={group.id}
                id={group.id}
                name={group.name}
                users={group.users}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
