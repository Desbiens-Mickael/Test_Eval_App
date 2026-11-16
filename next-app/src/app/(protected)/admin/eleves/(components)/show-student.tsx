"use client";

import ExerciseDoneDashboard from "@/app/(protected)/eleve/(learning)/exercices/(components)/exercise-done-dashboard";
import ExportGradesButton from "@/components/grade-export/export-grades-button";
import Loader from "@/components/loader";
import PageTitle from "@/components/page-title";
import { useGetStudentById } from "@/hooks/queries/student/use-get-student-by-id";
import { generateUserInitials } from "@/lib/utils";
import Image from "next/image";
import { toast } from "sonner";
import AccountStatusBadge from "./account-status-badge";
import PracticeTrackingSection from "./practice-tracking-section";
import StudentAccountCard from "./student-account-card";

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
          {data && (
            <AccountStatusBadge isActive={data.isActive} disabledAt={data.disabledAt} />
          )}
          <ExportGradesButton kind="student" id={studentId} />
        </div>
      </div>

      {data && (
        <div className="mb-10">
          <StudentAccountCard
            studentId={studentId}
            name={data.name}
            identifier={data.identifier}
            isActive={data.isActive}
            disabledAt={data.disabledAt}
          />
        </div>
      )}

      <div className="w-full flex flex-col gap-10">
        <PracticeTrackingSection studentId={studentId} />
        {/* Afficher tout les correction de l'élève */}
        <ExerciseDoneDashboard studentId={studentId} />
      </div>
    </>
  );
}
