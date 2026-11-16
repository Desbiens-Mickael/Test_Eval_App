import { Metadata } from "next";
import PracticeList from "./(components)/practice-list";

export const metadata: Metadata = {
  title: "Mes exercices",
};

export default function PracticePage() {
  return <PracticeList />;
}
