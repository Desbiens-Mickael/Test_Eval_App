"use client";

import { StudentInfos } from "@/type/student";

interface StudentInfosFormProps {
  student: StudentInfos;
}

export default function StudentInfosForm({ student }: StudentInfosFormProps) {
  return (
    <div>
      <div className="relative flex flex-col gap-8 p-4 my-4 border rounded-md ">
        <span className="absolute -top-3 left-4 text-slate-400 px-2 bg-white">
          {"Identifiant"}
        </span>
        {student.identifier}
      </div>
    </div>
  );
}
