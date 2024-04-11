import { DataTable } from "@/components/table/data-table";
import { Metadata } from "next";

import { columns } from "@/app/(protected)/admin/card-game/colums";

export const metadata: Metadata = {
  title: "Jeu de cartes",
};

const data = [
  {
    id: "1",
    lesson: "Leçon 1",
    title: "Exercice 1",
    level: "Facile",
    subject: "Maths",
  },
  {
    id: "2",
    lesson: "Leçon 1",
    title: "Exercice 2",
    level: "Facile",
    subject: "Français",
  },
  {
    id: "3",
    lesson: "Leçon 3",
    title: "Exercice 3",
    level: "Difficile",
    subject: "Histoire",
  },
  {
    id: "4",
    lesson: "Leçon 4",
    title: "Exercice 4",
    level: "Tres difficile",
    subject: "Physique",
  },
  {
    id: "5",
    lesson: "Leçon 5",
    title: "Exercice 5",
    level: "Tres difficile",
    subject: "Français",
  },
];

export default function CardGamePage() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <h1 className="text-6xl">Jeu de cartes</h1>

      <div className="w-full h-full mt-10">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
