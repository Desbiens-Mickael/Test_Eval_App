import { cn } from "@/lib/utils";
import { kodchasan } from "@/style/fonts";
import LinkCta from "../link-cta";

export default function Pricing() {
  const kodchasanFont = kodchasan.className;
  return (
    <section className="w-[90%] flex flex-col items-center gap-y-8 p-8 bg-secondary-foreground mx-auto rounded-xl border-2 border-primary shadow-xl mb-8">
      <h2 className={cn(kodchasanFont, "w-full md:w-[70%] text-lg md:text-2xl text-secondary text-center font-bold")}>
        Prêt à découvrir l’apprentissage interactif ? Rejoignez <span className="text-xl md:text-3xl font-extrabold bg-clip-text text-transparent bg-primary-gradient drop-shadow-md">EduCraft</span> et
        transformez les leçons en expériences inoubliables !
      </h2>
      <div className="flex flex-col md:flex-row items-center gap-4">
        <LinkCta href="/auth/inscription" text="Essayez gratuitement" LinkType="outline" className="w-full md:w-auto" />
        <LinkCta href="/auth/inscription" text="Abonnez-vous maintenant" className="w-full md:w-auto" />
      </div>
    </section>
  );
}
