"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Lock, Settings, User } from "lucide-react";

import { useGetUserByEmail } from "@/hooks/queries/use-get-user-by-email";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { UserInfosForm } from "./user-infos-form";
import { UserPreferencesForm } from "./user-preferences-form";
import { UserSecurityForm } from "./user-security-form";

const tabItems = [
  { value: "infos", label: "Informations", icon: User },
  { value: "preferences", label: "Préférences", icon: Settings },
  { value: "security", label: "Sécurité", icon: Lock },
];

export default function UserProfileManager() {
  const user = useCurrentUser();
  const userEmail = user?.email || "";
  const { isLoading, data } = useGetUserByEmail(userEmail);
  const [activeTab, setActiveTab] = useState<string>("infos");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3 bg-muted p-1 rounded-lg h-auto">
          {tabItems.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.value;
            return (
              <TabsTrigger
                disabled={tab.value === "security" && user?.isOAuth}
                key={tab.value}
                value={tab.value}
                className={cn(
                  "relative py-3 px-4 rounded-md transition-all duration-200 flex items-center justify-center gap-2",
                  isActive
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground/80"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="hidden sm:inline">{tab.label}</span>
                {isActive && <div />}
              </TabsTrigger>
            );
          })}
        </TabsList>
        <div className="relative">
          <div key={activeTab} className="w-full">
            <TabsContent value="infos" className="mt-0">
              <Card className="border-none shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-2xl font-semibold">
                    Informations du compte
                  </CardTitle>
                  <CardDescription>
                    Gérez vos informations personnelles et vos préférences de
                    compte
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <UserInfosForm
                    name={data?.name ?? null}
                    email={data?.email ?? null}
                    role={data?.role || "USER"}
                    isOAuth={user?.isOAuth || false}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="mt-0">
              <Card className="border-none shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-2xl font-semibold">
                    Préférences
                  </CardTitle>
                  <CardDescription>
                    Personnalisez votre expérience utilisateur
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <UserPreferencesForm imgPath={data?.image ?? null} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="mt-0">
              <Card className="border-none shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-2xl font-semibold">
                    Paramètres de sécurité
                  </CardTitle>
                  <CardDescription>
                    Gérez vos paramètres de sécurité et vos connexions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <UserSecurityForm
                    isTwoFactorEnabled={data?.isTwoFactorEnabled ?? false}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
