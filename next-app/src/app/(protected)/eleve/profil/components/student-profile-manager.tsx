"use client";

import Loader from "@/components/loader";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetStudentByIdentifier } from "@/hooks/queries/student/use-get-student-by-identifier";
import { useCurrentUser } from "@/hooks/use-current-user";
import StudentInfosForm from "./student-infos-form";
import StudentPreferencesForm from "./student-preferences-form";
import StudentSecurityForm from "./student-security-form";

export default function StudentProfileManager() {
  const student = useCurrentUser();
  const { data, isLoading, error } = useGetStudentByIdentifier(
    student?.identifier || ""
  );

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <Tabs defaultValue="infos" className="w-full lg:w-[800px] mx-auto">
          <TabsList className="grid w-full grid-cols-3 bg-foreground text-background">
            <TabsTrigger value="infos">Infos</TabsTrigger>
            <TabsTrigger value="preferences">Préférences</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
          </TabsList>
          <TabsContent value="infos">
            <Card>
              <CardHeader>
                <CardTitle>Infos</CardTitle>
                <CardDescription>Modifier vos informations.</CardDescription>
              </CardHeader>
              <CardContent>
                <StudentInfosForm student={data?.data!} />
              </CardContent>
              <CardFooter></CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Préférences</CardTitle>
                <CardDescription>Modifier vos préférences.</CardDescription>
              </CardHeader>
              <CardContent>
                <StudentPreferencesForm imgPath={data?.data?.image ?? null} />
              </CardContent>
              <CardFooter></CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Sécurité</CardTitle>
                <CardDescription>Modifier votre sécurité.</CardDescription>
              </CardHeader>
              <CardContent>
                <StudentSecurityForm />
              </CardContent>
              <CardFooter></CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </>
  );
}
