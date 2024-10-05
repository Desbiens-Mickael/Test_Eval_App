import { Metadata } from "next";
import ListTable from "./_components/list-table";

export const metadata: Metadata = {
  title: "Jeu à liste",
};

export default function ListGamePage() {
  return (
    <div className="w-full h-full flex flex-col items-center max-w-[1200px]">
      <h1 className="text-6xl font-bold mb-10">Jeu à liste</h1>
      <ListTable />
    </div>
  );
}
