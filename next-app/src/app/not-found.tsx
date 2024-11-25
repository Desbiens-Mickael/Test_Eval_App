import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

/**
 *
 * @returns {JSX.Element} A 404 page with an image and a link to the home page.
 */
export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center p-4">
      <h1 className="text-primary text-6xl font-bold">Not Found</h1>
      <Image src={"/assets/images/not-found.png"} width={500} height={500} alt="not found" />
      <p className="text-primary text-2xl md:text-3xl lg:text-4xl font-bold text-center">Impossible de trouver la ressource demandée</p>
      <Button asChild className="mt-5">
        <Link href="/">{"Retour à l'accueil"}</Link>
      </Button>
    </div>
  );
}
