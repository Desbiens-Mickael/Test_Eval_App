import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tableau de bord",
};

export default function Dashboard() {
  return (
    <div className="bg-secondary w-full max-w-[1500px]">
      <h1 className="text-6xl text-primary text-center">Dashboard</h1>
    </div>
  );
}
