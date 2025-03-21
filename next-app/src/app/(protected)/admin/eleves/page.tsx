import PageTitle from "@/components/page-title";
import { Metadata } from "next";
import StudentTable from "./(components)/student-table";

export const metadata: Metadata = {
  title: "Mes élèves",
};

export default function StudentsPage() {
  return (
    <>
      <PageTitle title="Mes élèves" />
      <StudentTable subject="" />
    </>
  );
}
