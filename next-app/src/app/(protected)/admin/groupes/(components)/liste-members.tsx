"use client";

import { Student } from "@/type/student";

interface ListeMembersProps {
  students: Student[];
}

export default function ListeMembers({ students }: ListeMembersProps) {
  return (
    <div className="flex flex-col gap-2 py-2">
      {students.length === 0 ? (
        <h3 className="text-xl font-bold text-center">Aucun élève</h3>
      ) : (
        students.map((user) => (
          <div
            key={user.id}
            className="flex justify-between items-center shadow-lg rounded-md p-2"
          >
            <h3 className="text-lg font-bold text-foreground">{user.name}</h3>
            {user.isActive ? (
              <div className="text-sm font-bold text-green-500 border border-green-500 rounded-xl py-[0.5px] px-2">
                Activé
              </div>
            ) : (
              <div className="text-sm font-bold text-red-500 border border-red-500 rounded-xl py-[0.5px] px-2">
                En attente
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
