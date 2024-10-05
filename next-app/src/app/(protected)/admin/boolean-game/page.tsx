import { Metadata } from "next";
import BooleanTable from "./_components/boolean-table";

export const metadata: Metadata = {
  title: "Jeu Vrai / Faux",
};

export default function BooleanGamePage() {
  return (
    <div className="w-full h-full flex flex-col items-center max-w-[1200px]">
      <h1 className="text-6xl font-bold mb-10">Jeu Vrai / Faux</h1>
      <BooleanTable />
    </div>
  );
}
