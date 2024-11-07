import { cn } from "@/lib/utils";
import { kodchasan } from "@/style/fonts";
import Link from "next/link";
import Logo from "./logo";

export default function Footer() {
  const year = new Date().getFullYear();
  const kodchasanFont = kodchasan.className;
  return (
    <footer className="w-full flex flex-col items-center bg-accent">
      <div className="w-full flex flex-col md:flex-row justify-around items-center p-6">
        <div className="flex flex-col justify-center items-center mb-4 md:mb-0">
          <Logo width={150} height={150} type="vertical" className="mb-4" />
          <p className="text-center text-sm">Une plateforme d'apprentissage en ligne pour les étudiants en informatique</p>
        </div>

        <div className="flex flex-col items-center gap-8">
          <div className="flex flex-col items-center">
            <h2 className={cn(kodchasanFont, "text-lg md:text-xl font-bold mb-4 text-foreground")}>À propos</h2>
            <p className="text-sm text-center">EduCraft propose des outils d’apprentissage interactifs pour les enfants et les enseignants.</p>
          </div>

          <div className="flex flex-wrap gap-8">
            <div className="flex flex-col items-center min-w-fit flex-1">
              <h2 className={cn(kodchasanFont, "text-lg md:text-xl font-bold text-foreground")}>Liens utiles</h2>
              <ul className="w-full flex flex-col items-center text-center gap-1 text-sm">
                <li>
                  <Link href="/conditions">Conditions d'utilisation</Link>
                </li>
                <li>
                  <Link href="/confidentialite">Politique de confidentialité</Link>
                </li>
                <li>
                  <Link href="/contact">Contact</Link>
                </li>
              </ul>
            </div>
            <div className="flex flex-col items-center min-w-fit flex-1">
              <h2 className={cn(kodchasanFont, "text-lg md:text-xl font-bold text-foreground")}>Suivez-nous</h2>
              <ul className="w-full flex flex-col items-center text-center gap-1 text-sm">
                <li>
                  <Link href="https://twitter.com/EduCraft">Twitter</Link>
                </li>
                <li>
                  <Link href="https://facebook.com/EduCraft">Facebook</Link>
                </li>
                <li>
                  <Link href="https://linkedin.com/company/EduCraft">LinkedIn</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center items-center bg-foreground p-4">
        <p className="text-center text-sm text-background">© {year} EduCraft. Tous droits réservés.</p>
      </div>
    </footer>
  );
}
