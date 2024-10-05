import { Metadata } from "next";
import CardTable from "./_components/card-table";

export const metadata: Metadata = {
  title: "Jeu de cartes",
};

export default function CardGamePage() {
  return (
    <div className="w-full h-full flex flex-col items-center max-w-[1200px]">
      <h1 className="text-6xl font-bold mb-10">Jeu de cartes</h1>
      <CardTable />
    </div>
  );
}
