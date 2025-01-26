"use client";

import { Student } from "@/type/group";

interface ListeMembersProps {
  students: Student[];
}

export default function ListeMembers({ students }: ListeMembersProps) {
  return (
    <div className="flex flex-col gap-2 py-2">
      {students.length === 0 ? (
        <h3 className="text-xl font-bold text-center">Aucun utilisateur</h3>
      ) : (
        students.map((user) => (
          <div
            key={user.id}
            className="flex justify-between items-center bg-gray-600 rounded-md p-2"
          >
            <h3 className="text-md font-bold text-background">
              {`${user.firstName} ${user.lastName}`}
            </h3>
            {user.isActive ? (
              <div className="text-sm text-green-100 bg-green-500 rounded-xl py-[0.5px] px-2">
                Active
              </div>
            ) : (
              <div className="text-sm text-red-100 bg-primary rounded-xl py-[0.5px] px-2">
                En attente
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
