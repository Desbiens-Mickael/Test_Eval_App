import { cn } from "@/lib/utils";
import { kodchasan } from "@/style/fonts";
import Image from "next/image";

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
        <span className="text-start font-extrabold bg-clip-text text-transparent bg-primary-gradient drop-shadow">
          EduCraft
        </span>
      </h2>
      <div className="w-full flex flex-col gap-y-20">
        <div className="w-full lg:h-[500px] flex flex-col md:flex-row p-4 bg-secondary-foreground">
          <div className="md:w-1/2 flex flex-col justify-center items-center lg:p-16">
            <h3
              className={cn(
                kodchasanFont,
                "text-primary-200 text-xl md:text-3xl text-center font-bold"
              )}
            >
              Création de leçons personnalisées
            </h3>
            <p className="text-secondary text-sm md:text-lg p-4 md:p-8">
              Donnez vie aux leçons de votre choix avec une liberté totale ! Que
              ce soit pour approfondir un sujet ou créer une nouvelle
              compétence,{" "}
              <span className="text-lg md:text-xl font-extrabold bg-clip-text text-transparent bg-primary-gradient drop-shadow">
                EduCraft
              </span>{" "}
              vous permet de concevoir des leçons adaptées aux besoins de chaque
              élève.
            </p>
          </div>
          <div className="md:w-1/2">
            <Image
              src={"/assets/images/lesson.webp"}
              width={480}
              height={400}
              alt="lesson"
              className="h-auto w-full md:w-auto md:h-full mx-auto object-cover rounded-xl md:rounded-3xl md:rounded-tl-[150px] md:rounded-br-[150px] drop-shadow-lg"
            />
          </div>
        </div>

        <div className="w-full lg:h-[500px] flex flex-col md:flex-row-reverse p-4 bg-secondary-foreground">
          <div className="md:w-1/2 flex flex-col justify-center items-center lg:p-16">
            <h3
              className={cn(
                kodchasanFont,
                "text-primary-200 text-xl md:text-3xl text-center font-bold"
              )}
            >
              {"Création d'exercices interactifs"}
            </h3>
            <p className="text-secondary text-sm md:text-lg p-4 md:p-8">
              {
                "Engagez vos enfants avec des exercices ludiques et interactifs. Nos outils intuitifs vous permettent de créer des activités captivantes comme des glisser-déposer, des quiz, et des exercices à trous, pour un apprentissage dynamique."
              }
            </p>
          </div>
          <div className="md:w-1/2">
            <Image
              src={"/assets/images/exercice.webp"}
              width={480}
              height={400}
              alt="lesson"
              className="h-auto w-full md:w-auto md:h-full mx-auto object-cover rounded-xl md:rounded-3xl md:rounded-tl-[150px] md:rounded-br-[150px] drop-shadow-lg"
            />
          </div>
        </div>

        <div className="w-full lg:h-[500px] flex flex-col md:flex-row p-4 bg-secondary-foreground">
          <div className="md:w-1/2 flex flex-col justify-center items-center lg:p-16">
            <h3
              className={cn(
                kodchasanFont,
                "text-primary-200 text-xl md:text-3xl text-center font-bold"
              )}
            >
              {"Suivi de la progression de l'apprentissage"}
            </h3>
            <p className="text-secondary text-sm md:text-lg p-4 md:p-8">
              {"Gardez un œil sur les progrès de votre enfant !"}
              <span className="text-lg md:text-xl font-extrabold bg-clip-text text-transparent bg-primary-gradient drop-shadow">
                EduCraft
              </span>
              {
                "propose des graphiques clairs et faciles à lire qui montrent l’évolution dans chaque matière, pour un accompagnement personnalisé tout au long de son parcours."
              }
            </p>
          </div>
          <div className="md:w-1/2">
            <Image
              src={"/assets/images/graphique.webp"}
              width={480}
              height={400}
              alt="lesson"
              className="h-auto w-full md:w-auto md:h-full mx-auto object-cover rounded-xl md:rounded-3xl md:rounded-tl-[150px] md:rounded-br-[150px] drop-shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
