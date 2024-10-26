// "use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Erreur d'authentification",
};

export default function AuthErrorPage() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <Card>
        <CardTitle>{"Une erreur c'est produite!"}</CardTitle>
        <CardContent>
          <p>{"Oops il s'emblerait qu'une erreur c'est produite!"}</p>
        </CardContent>
      </Card>
    </div>
  );
}
