import { cn } from "@/lib/utils";
import { kodchasan } from "@/style/fonts";
import ExplanatoryCard from "../explanatory-card";

export default function ExplanatorySection() {
  const kodchasanFont = kodchasan.className;
  return (
    <section className="w-full flex flex-col py-12">
      <h2
        className={cn(
          kodchasanFont,
          "w-full text-primary text-2xl md:text-4xl text-center md:text-start font-bold md:ms-8 pb-4"
        )}
      >
        {"Fonctionnalités principales d'"}
        <span
          className={cn(
            kodchasanFont,
            "text-start font-extrabold bg-clip-text text-transparent bg-primary-gradient drop-shadow"
          )}
        >
          EduCraft
        </span>
      </h2>
      <div className="w-full flex flex-col gap-y-20">
        <ExplanatoryCard
          title="Création de leçons personnalisées"
          image="/assets/images/lesson.webp"
          reverseMode={false}
        >
          <p className="text-md text-muted-foreground md:text-lg">
            Donnez vie aux leçons de votre choix avec une liberté totale ! Que
            ce soit pour approfondir un sujet ou créer une nouvelle compétence,{" "}
            <span
              className={cn(
                kodchasanFont,
                "font-extrabold bg-clip-text text-transparent bg-primary-gradient drop-shadow"
              )}
            >
              EduCraft
            </span>{" "}
            vous permet de concevoir des leçons adaptées aux besoins de chaque
            élève.
          </p>
        </ExplanatoryCard>
        <ExplanatoryCard
          title="Création d'exercices interactifs"
          image="/assets/images/exercice.webp"
          reverseMode={true}
        >
          <p className="text-md text-muted-foreground md:text-lg">
            Engagez vos enfants avec des exercices ludiques et interactifs. Nos
            outils intuitifs vous permettent de créer des activités captivantes
            comme des glisser-déposer, des quiz, et des exercices à trous, pour
            un apprentissage dynamique.
          </p>
        </ExplanatoryCard>
        <ExplanatoryCard
          title="Suivi de la progression de l'apprentissage"
          image="/assets/images/graphique.webp"
          reverseMode={false}
        >
          <p className="text-md text-muted-foreground md:text-lg">
            Gardez un œil sur les progrès de votre enfant !{" "}
            <span
              className={cn(
                kodchasanFont,
                "font-extrabold bg-clip-text text-transparent bg-primary-gradient drop-shadow"
              )}
            >
              EduCraft
            </span>{" "}
            propose des graphiques clairs et faciles à lire qui montrent
            l’évolution dans chaque matière, pour un accompagnement personnalisé
            tout au long de son parcours.
          </p>
        </ExplanatoryCard>
      </div>
    </section>
  );
}
