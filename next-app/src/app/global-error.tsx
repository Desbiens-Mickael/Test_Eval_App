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
      <body className="flex justify-center items-center min-h-screen text-secondary p-4">
        <Card className="bg-background text-red-600 border-red-600">
          <CardHeader>
            <CardTitle>{"Une erreur c'est produite!"}</CardTitle>
            <CardDescription>{error.message}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              {"Oops il s'emblerait qu'une erreur non prévue c'est produite!"}
            </p>
          </CardContent>
          <CardFooter>
            <Button
              className="text-red-600 border-red-600 hover:bg-red-100 hover:text-red-600"
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
