import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-full w-full flex flex-col justify-center items-center bg-gradient-to-r from-black via-slate-100 to-black">
      <h2>Not Found</h2>
      <Image src={"/assets/images/not-found.webp"} width={500} height={500} alt="not found" />
      <p className="text-primary text-4xl font-bold">Impossible de trouver la ressource demandée</p>
      <Button asChild variant="link">
        <Link href="/">{"Retour à l'accueil"}</Link>
      </Button>
    </div>
  );
}
