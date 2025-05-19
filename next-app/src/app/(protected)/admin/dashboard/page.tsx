import PageTitle from "@/components/page-title";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tableau de bord",
};

export default function Dashboard() {
  return <PageTitle title="Tableau de bord" />;
}
