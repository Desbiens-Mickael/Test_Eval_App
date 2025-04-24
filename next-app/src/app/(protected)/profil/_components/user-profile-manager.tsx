"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Loader from "@/components/loader";
import { useGetUserByEmail } from "@/hooks/queries/use-get-user-by-email";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useState } from "react";
import { UserInfosForm } from "./user-infos-form";
import { UserPreferencesForm } from "./user-preferences-form";
import { UserSecurityForm } from "./user-security-form";

export default function UserPRofileManager() {
  const user = useCurrentUser();
  const userEmail = user?.email || "";
  const { isLoading, data } = useGetUserByEmail(userEmail);
  const [tabName, setTabName] = useState<string>("infos");

  const handleClick = (tabName: string) => {
    setTabName(tabName);
  };

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
                <UserInfosForm
                  name={data?.name ?? null}
                  email={data?.email ?? null}
                  role={data?.role || "USER"}
                  isOAuth={user?.isOAuth || false}
                />
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
                <UserPreferencesForm imgPath={data?.image ?? null} />
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
                <UserSecurityForm
                  isTwoFactorEnabled={data?.isTwoFactorEnabled ?? false}
                />
              </CardContent>
              <CardFooter></CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </>

    // <div className="h-auto w-full flex flex-col items-center">
    //   <h1 className="text-6xl font-semibold mb-8 ">Mon profil</h1>
    //   <div className="h-auto w-full lg:w-[800px] shadow-xl rounded-md overflow-hidden">
    //     <div className="w-full flex items-center divide-x divide-gray-500">
    //       <Button
    //         className={cn(
    //           "rounded-none grow",
    //           tabName === "infos" ? "bg-slate-500" : ""
    //         )}
    //         onClick={() => handleClick("infos")}
    //       >
    //         Infos
    //       </Button>
    //       <Button
    //         className={cn(
    //           "rounded-none grow",
    //           tabName === "preferences" ? "bg-slate-500" : ""
    //         )}
    //         onClick={() => handleClick("preferences")}
    //       >
    //         Préférences
    //       </Button>
    //       <Button
    //         className={cn(
    //           "rounded-none grow",
    //           tabName === "security" ? "bg-slate-500" : ""
    //         )}
    //         disabled={user?.isOAuth}
    //         onClick={() => handleClick("security")}
    //       >
    //         Sécurité
    //       </Button>
    //     </div>

    //     <div className="h-auto w-full p-8 rounded-md">
    //       {!isLoading ? (
    //         <>
    //           {tabName === "infos" && (
    //             <UserInfosForm
    //               name={data?.name ?? null}
    //               email={data?.email ?? null}
    //               role={data?.role || "USER"}
    //               isOAuth={user?.isOAuth || false}
    //             />
    //           )}
    //           {tabName === "preferences" && (
    //             <UserPreferencesForm imgPath={data?.image ?? null} />
    //           )}
    //           {tabName === "security" && (
    //             <UserSecurityForm
    //               isTwoFactorEnabled={data?.isTwoFactorEnabled ?? false}
    //             />
    //           )}
    //         </>
    //       ) : (
    //         <Loader />
    //       )}
    //     </div>
    //   </div>
    // </div>
  );
}
