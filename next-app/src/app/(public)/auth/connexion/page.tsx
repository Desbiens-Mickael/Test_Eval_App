import AuthenticationWrapper from "@/components/auth/authentication-wrapper";
import FormLoginProfessor from "@/components/auth/form-login-professor";
import FormLoginStudent from "@/components/auth/form-login-student";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Connexion",
};

export default function LoginPage() {
  return (
    <AuthenticationWrapper
      title="Connexion"
      imagePath="/assets/images/login.webp"
    >
      <Tabs defaultValue="teacher" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-foreground text-background">
          <TabsTrigger value="teacher">Professeur</TabsTrigger>
          <TabsTrigger value="student">Élève</TabsTrigger>
        </TabsList>
        <TabsContent value="teacher">
          <Card className="justify-center">
            <CardHeader>
              <CardTitle>Professeur</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <FormLoginProfessor />
              <Button variant={"link"} asChild className="w-fit mx-auto">
                <Link href="/auth/inscription" className="gap-2">
                  Pas encore de compte ? CRÉER UN COMPTE
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="student" className="align-center">
          <Card className="justify-center">
            <CardHeader>
              <CardTitle>Élève</CardTitle>
            </CardHeader>
            <CardContent>
              <FormLoginStudent />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AuthenticationWrapper>
  );
}
