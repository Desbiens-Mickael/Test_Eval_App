import { DataTable } from "@/components/table/data-table";
import { Metadata } from "next";

import { Exercice, columns } from "@/app/(protected)/admin/card-game/colums";

export const metadata: Metadata = {
  title: "Jeu de cartes",
};

const data: Exercice[] = [
  {
    id: "1",
    lesson: "Le theorème de pythagore",
    title: "Trouve la bonne reponse pour le theoreme de pythagore",
    level: "🟢 Facile",
    subject: "Maths",
  },
  {
    id: "2",
    lesson: "Les verbes irreguliers",
    title: "Replace les verbes irreguliers",
    level: "🟢 Facile",
    subject: "Français",
  },
  {
    id: "3",
    lesson: "L'histoire de la troisime guerre mondiale",
    title: "Retrouve l'histoire de la troisième guerre mondiale",
    level: "🟡 Difficile",
    subject: "Histoire",
  },
  {
    id: "4",
    lesson: "La phusion nucleaire",
    title: "Trouve la bonne reponse pour la phusion nucleaire",
    level: "🔴Très difficile",
    subject: "Physique",
  },
  {
    id: "5",
    lesson: "Le participe passe",
    title: "Trouve la bonne reponse pour le participe passe",
    level: "🔴Très difficile",
    subject: "Français",
  },
  {
    id: "6",
    lesson: "L'histoire de la deuxieme guerre mondiale",
    title: "Retrouve l'histoire de la deuxième guerre mondiale",
    level: "🟡 Difficile",
    subject: "Histoire",
  },
  {
    id: "7",
    lesson: "La phusion nucleaire",
    title: "Trouve la bonne reponse pour la phusion nucleaire",
    level: "🔴Très difficile",
    subject: "Physique",
  },
  {
    id: "8",
    lesson: "Le participe passe",
    title: "Trouve la bonne reponse pour le participe passe",
    level: "🔴Très difficile",
    subject: "Français",
  },
  {
    id: "9",
    lesson: "Le theorème de pythagore",
    title: "Trouve la bonne reponse pour le theoreme de pythagore",
    level: "🟢 Facile",
    subject: "Maths",
  },
  {
    id: "10",
    lesson: "Les verbes irreguliers",
    title: "Replace les verbes irreguliers",
    level: "🟢 Facile",
    subject: "Français",
  },
  {
    id: "11",
    lesson: "L'histoire de la troisime guerre mondiale",
    title: "Retrouve l'histoire de la troisième guerre mondiale",
    level: "🟡 Difficile",
    subject: "Histoire",
  },
];

export default function CardGamePage() {
  return (
    <div className="w-full h-full flex flex-col items-center max-w-[1200px]">
      <h1 className="text-6xl font-bold mb-10">Jeu de cartes</h1>

      <DataTable columns={columns} data={data} filterColumnIds={["Matière", "Niveau"]} inputSearch viewOptionsButton />
    </div>
  );
}
