import { Metadata } from "next";
import FillBlankTable from "./_components/fill-blank-table";

export const metadata: Metadata = {
  title: "Jeu à trou",
};

export default function HoleGamePage() {
  return (
    <div className="w-full h-full flex flex-col items-center max-w-[1200px]">
      <h1 className="text-6xl font-bold mb-10">Jeu de trou</h1>
      <FillBlankTable />
    </div>
  );
}
