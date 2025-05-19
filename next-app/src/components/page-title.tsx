"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PageTitleProps {
  title: string;
  className?: string;
  subtitle?: string;
  centered?: boolean;
}

export default function PageTitle({
  title,
  className,
  subtitle,
  centered = true,
}: PageTitleProps) {
  return (
    <div
      className={cn(
        "w-full mb-8 md:mb-16",
        centered ? "text-center" : "text-left"
      )}
    >
      {subtitle && (
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="inline-block text-primary font-medium text-sm md:text-base mb-3"
        >
          {subtitle}
        </motion.span>
      )}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className={cn(
          "text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-primary-gradient",
          "relative inline-block",
          className
        )}
      >
        {title}
        <motion.span
          className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-gradient"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        />
      </motion.h1>
    </div>
  );
}
