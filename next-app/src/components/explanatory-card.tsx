import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { kodchasan } from "@/style/fonts";
import Image from "next/image";

interface ExplanatoryCardProps {
  title: string;
  children: React.ReactNode;
  image: string;
  reverseMode?: boolean;
}

export default function ExplanatoryCard({
  title,
  children,
  image,
  reverseMode = false,
}: ExplanatoryCardProps) {
  return (
    <Card className="group overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl dark:shadow-primary/10">
      <div
        className={cn(
          "flex flex-col items-center gap-6 p-6 md:h-[500px] md:flex-row md:gap-8 md:p-0",
          reverseMode ? "md:flex-row-reverse" : "md:flex-row"
        )}
      >
        {/* Contenu texte */}
        <div className="flex w-full flex-col justify-center p-6 md:w-1/2 md:p-12 lg:p-16">
          <h3
            className={cn(
              kodchasan.className,
              "mb-4 text-center text-2xl font-bold leading-tight text-foreground md:mb-6 md:text-3xl lg:text-4xl"
            )}
          >
            {title}
          </h3>
          {children}
        </div>

        {/* Image */}
        <div className="relative h-64 w-full overflow-hidden md:h-full md:w-1/2">
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent md:bg-gradient-to-r md:from-background/80 md:to-transparent" />
          <Image
            src={image}
            alt={title}
            fill
            className={cn(
              "object-cover transition-transform duration-700 group-hover:scale-105",
              reverseMode
                ? "rounded-t-lg md:rounded-l-none md:rounded-r-lg"
                : "rounded-t-lg md:rounded-r-none md:rounded-l-lg"
            )}
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
      </div>
    </Card>
  );
}
