"use client";

import { ChartNoAxesCombined, PencilRuler, SquarePen } from "lucide-react";
import ServiceCard from "../service-card";

export default function ServiceCardSection() {
  const services = [
    {
      title: "Simplicité de création",
      text: "Créez des leçons en quelques clics, grâce à une interface intuitive et des outils conçus pour vous faciliter la tâche.",
      icon: SquarePen,
    },
    {
      title: "Suivi personnalisé",
      text: "Suivez les progrès de votre enfant ou de vos élèves avec des graphiques détaillés et des rapports personnalisés.",
      icon: ChartNoAxesCombined,
    },
    {
      title: "Exercices interactifs",
      text: "Proposez des activités ludiques et stimulantes, comme des exercices de glisser-déposer, des quiz à trous, et des jeux éducatifs.",
      icon: PencilRuler,
    },
  ];

  return (
    <section className="w-full lg:w-[90%] mx-auto flex flex-wrap gap-8 p-6 lg:-mt-[50px] z-10">
      <h2 className="sr-only">Pourquoi choisir Educraft ?</h2>
      {services.map((service) => (
        <ServiceCard key={service.title} {...service} />
      ))}
    </section>
  );
}
