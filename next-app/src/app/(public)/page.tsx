import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accueil",
};

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center gap-10 w-full h-full">
      <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">Bienvenue sur Test Eval !!!</h1>
    </div>
  );
}
