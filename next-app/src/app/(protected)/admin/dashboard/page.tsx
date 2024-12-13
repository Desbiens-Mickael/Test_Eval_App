import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tableau de bord",
};

export default function Dashboard() {
  return (
    <>
      <h1 className="text-6xl text-primary text-center">Dashboard</h1>
    </>
  );
}
