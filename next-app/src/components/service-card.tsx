import { Separator } from "@radix-ui/react-separator";
import { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  title: string;
  text: string;
  icon: LucideIcon;
}

export default function ServiceCArd({ title, text, icon: Icon }: ServiceCardProps) {
  return (
    <div className="flex-1 min-w-[300px] flex flex-col items-center p-6 rounded-lg bg-accent shadow-xl">
      <div className="flex justify-center items-center gap-4">
        <Icon className="text-primary" />
        <h3 className="text-xl font-bold text-secondary">{title}</h3>
      </div>
      <Separator className="my-4" />
      <p className="text-sm l text-secondary text-justify">{text}</p>
    </div>
  );
}
