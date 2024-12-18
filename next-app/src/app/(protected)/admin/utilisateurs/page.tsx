import PageTitle from "@/components/page-title";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mes Abonnés",
};

export default function RegisteredPage() {
  return (
    <>
      <PageTitle title="Mes Abonnés" />
    </>
  );
}
