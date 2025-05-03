import PageTitle from "@/components/page-title";
import { Metadata } from "next";
import GroupDashboard from "./(components)/group-dashboard";

export const metadata: Metadata = {
  title: "Mes groupes",
};

export default function LearnersPage() {
  return (
    <>
      <PageTitle title="Mes groupes" />
      <GroupDashboard />
    </>
  );
}
