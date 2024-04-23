import { DataTable } from "@/components/table/data-table";
import { Metadata } from "next";

import { columns } from "@/app/(protected)/admin/card-game/colums";
import { exerciceData } from "./data";

export const metadata: Metadata = {
  title: "Jeu de cartes",
};

export default function CardGamePage() {
  const filterColumnIds = ["Matière", "Niveau"];
  const inputSearchColumnId = ["Titre"];

  return (
    <div className="w-full h-full flex flex-col items-center max-w-[1200px]">
      <h1 className="text-6xl font-bold mb-10">Jeu de cartes</h1>

      <DataTable columns={columns} data={exerciceData} filterColumnIds={filterColumnIds} inputSearchColumnId={inputSearchColumnId} viewOptionsButton />
    </div>
  );
}
