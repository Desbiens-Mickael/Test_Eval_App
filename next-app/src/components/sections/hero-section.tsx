"use client";

import { Skeleton } from "@/components/ui/skeleton";
import useMediaQuery from "@/hooks/use-media-query";
import dynamic from "next/dynamic";

// Chargement dynamique des composants avec un état de chargement
const HeroDesktop = dynamic(() => import("./hero/hero-desktop"), {
  loading: () => <Skeleton className="w-full h-[500px]" />,
  ssr: false,
});

const HeroMobile = dynamic(() => import("./hero/hero-mobile"), {
  loading: () => <Skeleton className="w-full h-[400px]" />,
  ssr: false,
});

export default function HeroSection() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="w-full">{isMobile ? <HeroMobile /> : <HeroDesktop />}</div>
  );
}
