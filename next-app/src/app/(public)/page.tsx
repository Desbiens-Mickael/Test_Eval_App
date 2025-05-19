import ScrollingSubjectBanner from "@/components/scrolling-subject-banner";
import ExplanatorySection from "@/components/sections/explanatory-section";
import HeroSection from "@/components/sections/hero-section";
import Pricing from "@/components/sections/pricing";
import ServiceCardSection from "@/components/sections/service-card-section";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accueil",
};

export default function Home() {
  const subjects = [
    "Mathématiques",
    "Physique",
    "Biologie",
    "Anglais",
    "Histoire",
    "Français",
  ];
  return (
    <div className="flex flex-col max-w-screen-2xl h-full">
      <HeroSection />
      <ServiceCardSection />
      <div className="w-full overflow-hidden">
        <ScrollingSubjectBanner baseVelocity={5} subjects={subjects} />
        <ScrollingSubjectBanner baseVelocity={-5} subjects={subjects} />
      </div>
      <ExplanatorySection />
      <Pricing />
    </div>
  );
}
