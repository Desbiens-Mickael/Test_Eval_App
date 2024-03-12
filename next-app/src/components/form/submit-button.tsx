import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface submitButtonProps {
  texte: string;
  isLoading: boolean;
  loadindText?: string;
  className?: string;
}

export default function SubmitButton({ texte, className, loadindText = "En cour...", isLoading = false }: submitButtonProps) {
  return (
    <Button disabled={isLoading} type="submit" className={cn("flex w-full text-lg font-semibold px-5", className)}>
      {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
      <span>{isLoading ? loadindText : texte}</span>
    </Button>
  );
}
