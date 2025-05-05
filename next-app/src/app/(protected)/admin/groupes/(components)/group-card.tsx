"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Student } from "@/type/student";
import { FolderKanban, Users } from "lucide-react";
import { useRouter } from "next/navigation";

interface GroupCardProps {
  id: string;
  name: string;
  students: Student[];
}

export default function GroupCard({ id, name, students }: GroupCardProps) {
  const router = useRouter();

  return (
    <Card
      onClick={() => {
        router.push(`/admin/groupes/${id}`);
      }}
      className="w-full lg:w-[250px] 
        bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md 
        overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
    >
      <CardHeader
        className="bg-gradient-to-r from-gray-100 to-gray-200 
        dark:from-gray-700 dark:to-gray-600
        p-4 
        flex flex-row items-center 
        justify-between"
      >
        <CardTitle className="w-full text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <FolderKanban className="w-6 h-6 text-primary" />
          <span className="truncate">{name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex items-center justify-between ">
        <div className="flex gap-2">
          <Users className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          {students.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">Aucun élève</p>
          ) : (
            <p className="font-semibold text-gray-700 dark:text-gray-200">
              {`${students.length} ${students.length > 1 ? "élèves" : "élève"}`}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
