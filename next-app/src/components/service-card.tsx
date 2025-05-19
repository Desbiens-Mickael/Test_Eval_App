import { Separator } from "@radix-ui/react-separator";
import { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  title: string;
  text: string;
  icon: LucideIcon;
}

export default function ServiceCard({
  title,
  text,
  icon: Icon,
}: ServiceCardProps) {
  return (
    <div className="group flex-1 min-w-[300px] flex flex-col items-center p-8 rounded-xl bg-gradient-to-br from-card to-accent/80 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-border/50 hover:border-primary/30 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10 w-full flex flex-col items-center">
        <div className="flex justify-center items-center gap-4 mb-2">
          <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
            <Icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
          </div>
          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>
        </div>

        <Separator className="my-4 w-16 h-0.5 bg-primary/30 group-hover:bg-primary/60 transition-colors duration-300" />

        <p className="text-sm text-muted-foreground text-center leading-relaxed group-hover:text-foreground transition-colors duration-300">
          {text}
        </p>
      </div>
    </div>
  );
}
