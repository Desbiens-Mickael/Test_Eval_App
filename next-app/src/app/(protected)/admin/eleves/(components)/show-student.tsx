"use client";

import ExerciseDoneDashboard from "@/app/(protected)/eleve/exercices/(components)/exercise-done-dashboard";
import Loader from "@/components/loader";
import PageTitle from "@/components/page-title";
import { Badge } from "@/components/ui/badge";
import { useGetStudentById } from "@/hooks/queries/student/use-get-student-by-id";
import { generateUserInitials } from "@/lib/utils";
import Image from "next/image";
import { toast } from "sonner";

interface ShowStudentProps {
  studentId: string;
}

export default function ShowStudent({ studentId }: ShowStudentProps) {
  const { data, isLoading, isError, error } = useGetStudentById({
    studentId,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return toast.error(error?.message);
  }

  const initialTitle = generateUserInitials(data?.name || "");
  return (
    <>
      <div className="w-full flex flex-col gap-4 mb-28">
        <div className="w-full flex justify-center items-center gap-8 ">
          <PageTitle title={data?.name || ""} className="mb-0" />
          <div className="w-24 h-24 flex items-center justify-center bg-foreground rounded-full text-5xl text-primary-foreground font-bold overflow-hidden">
            {data?.image ? (
              <Image src={data?.image} alt="profile" width={50} height={50} />
            ) : (
              initialTitle
            )}
          </div>
        </div>
        <div className="w-full flex flex-col items-center gap-4">
          <p className="text-center">
            Groupe :{" "}
            <span className="font-bold">{data?.groupStudent?.name || ""}</span>
          </p>
          <Badge
            className={`border-2 bg-inherit font-bold px-2 py-[0.5px] ${
              data?.isActive
                ? "border-green-500 text-green-500"
                : "border-red-500 text-red-500"
            }`}
          >
            {data?.isActive ? "Activé" : "En attente"}
          </Badge>
        </div>
      </div>

      <div className="w-full flex flex-col gap-10">
        {/* Box pour les graphiques */}
        {/* TODO: créer un composant pour les graphiques réutilisable */}
        <h2 className="text-2xl font-bold">
          Box pour les graphique (prochainement)
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="bg-slate-500 p-4 rounded-lg shadow-sm h-40"></div>
          <div className="bg-slate-500 p-4 rounded-lg shadow-sm h-40"></div>
          <div className="bg-slate-500 p-4 rounded-lg shadow-sm h-40"></div>
          <div className="bg-slate-500 p-4 rounded-lg shadow-sm h-40"></div>
        </div>
        {/* Afficher tout les correction de l'élève */}
        <ExerciseDoneDashboard studentId={studentId} />
      </div>
    </>
  );
}
