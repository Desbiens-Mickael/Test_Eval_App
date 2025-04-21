import PageTitle from "@/components/page-title";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tableau de bord - Élève",
};

export default function StudentDashboard() {
  return <PageTitle title="Tableau de bord - Élève" />;
}
