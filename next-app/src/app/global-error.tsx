"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Error boundaries must be Client Components

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    // global-error must include html and body tags
    <html lang="fr">
      <body className="flex justify-center items-center min-h-screen bg-background text-primary p-4">
        <Card className="bg-error text-primary-foreground border-error">
          <CardHeader>
            <CardTitle>{"Oups ! Une erreur est survenue 😵"}</CardTitle>
            <CardDescription>{error.message}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              {"Essayez de recharger la page ou contactez l'administrateur."}
            </p>
          </CardContent>
          <CardFooter>
            <Button
              className="text-primary-foreground border-primary-foreground hover:bg-primary-100 hover:text-primary-foreground"
              variant={"outline"}
              onClick={() => reset()}
            >
              {"Reessayer"}
            </Button>
          </CardFooter>
        </Card>
      </body>
    </html>
  );
}
