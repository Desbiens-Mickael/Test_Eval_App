import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-full w-full flex flex-col justify-center items-center p-4">
      <h2 className="text-primary text-6xl font-bold">Not Found</h2>
      <Image src={"/assets/images/not-found.png"} width={500} height={500} alt="not found" />
      <p className="text-primary text-2xl md:text-3xl lg:text-4xl font-bold text-center">Impossible de trouver la ressource demandée</p>
      <Button asChild className="mt-5">
        <Link href="/">{"Retour à l'accueil"}</Link>
      </Button>
    </div>
  );
}
