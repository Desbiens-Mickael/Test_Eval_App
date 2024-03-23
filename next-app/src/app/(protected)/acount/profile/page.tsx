"use client";

import { UserInfosForm } from "@/app/(protected)/acount/_components/user-infos-form";
import { Button } from "@/components/ui/button";
import { useUserByEmail } from "@/hooks/data/queries/use-get-user-by-email";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";
import { Suspense, useState } from "react";
import { UserPreferencesForm } from "../_components/user-preferences-form";
import { UserSecurityForm } from "../_components/user-security-form";

export default function ProfilePage() {
  const user = useCurrentUser();
  const userEmail = user?.email;

  const { isLoading, data, isError, error } = useUserByEmail(userEmail);
  const [tabName, setTabName] = useState<string>("infos");

  return (
    <div className="h-auto w-full flex flex-col items-center">
      <h1 className="text-6xl font-semibold mb-8 ">Mon profil</h1>
      <div className="h-auto w-full lg:w-[800px] shadow-xl rounded-md overflow-hidden">
        <div className="w-full flex items-center">
          <Button className={cn("rounded-none grow", tabName === "infos" ? "bg-slate-500" : "")} onClick={() => setTabName("infos")}>
            Mes infos
          </Button>
          <Button className={cn("rounded-none grow", tabName === "preferences" ? "bg-slate-500" : "")} onClick={() => setTabName("preferences")}>
            Mes préférences
          </Button>
          <Button className={cn("rounded-none grow", tabName === "security" ? "bg-slate-500" : "")} disabled={user?.isOAuth} onClick={() => setTabName("security")}>
            Sécurité
          </Button>
        </div>

        <div className="h-auto w-full p-8 rounded-md">
          {!isLoading ? (
            <>
              {tabName === "infos" && (
                <Suspense fallback={<p>Loading...</p>}>
                  <UserInfosForm name={data?.name ?? null} email={data?.email ?? null} role={data?.role || "USER"} isOAuth={user?.isOAuth || false} />
                </Suspense>
              )}
              {tabName === "preferences" && (
                <Suspense fallback={<p>Loading...</p>}>
                  <UserPreferencesForm imgPath={data?.image ?? null} />
                </Suspense>
              )}
              {tabName === "security" && (
                <Suspense fallback={<p>Loading...</p>}>
                  <UserSecurityForm isTwoFactorEnabled={data?.isTwoFactorEnabled ?? false} />
                </Suspense>
              )}
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
}
