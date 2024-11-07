"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";

interface linkCtaProps {
  href: string;
  text: string;
  LinkType?: "default" | "outline";
  className?: string;
  onClick?: () => void;
}

const classLink = {
  default: "bg-gradient-to-r from-primary  to-primary-200  text-primary-foreground",
  outline: "bg-primary-foreground text-primary border border-primary hover:bg-orange-500 hover:text-white",
};

export default function LinkCta({ href, text, className, onClick, LinkType = "default" }: linkCtaProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex justify-center items-center font-bold py-2 px-8 rounded-full shadow-md hover:-translate-y-1 hover:scale-110 hover:shadow-xl transition-all duration-200",
        classLink[LinkType],
        className
      )}
    >
      {text}
    </Link>
  );
}
