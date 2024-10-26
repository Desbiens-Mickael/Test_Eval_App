"use client";

import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { useUserByEmail } from "@/hooks/queries/use-get-user-by-email";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { UserInfosForm } from "./user-infos-form";
import { UserPreferencesForm } from "./user-preferences-form";
import { UserSecurityForm } from "./user-security-form";

export default function UserPRofileManager() {
  const user = useCurrentUser();
  const userEmail = user?.email;
  const { isLoading, data, isError, error } = useUserByEmail(userEmail);
  const [tabName, setTabName] = useState<string>("infos");

  const handleClick = (tabName: string) => {
    setTabName(tabName);
  };

  return (
    <div className="h-auto w-full flex flex-col items-center">
      <h1 className="text-6xl font-semibold mb-8 ">Mon profil</h1>
      <div className="h-auto w-full lg:w-[800px] shadow-xl rounded-md overflow-hidden">
        <div className="w-full flex items-center divide-x divide-gray-500">
          <Button className={cn("rounded-none grow", tabName === "infos" ? "bg-slate-500" : "")} onClick={() => handleClick("infos")}>
            Infos
          </Button>
          <Button className={cn("rounded-none grow", tabName === "preferences" ? "bg-slate-500" : "")} onClick={() => handleClick("preferences")}>
            Préférences
          </Button>
          <Button className={cn("rounded-none grow", tabName === "security" ? "bg-slate-500" : "")} disabled={user?.isOAuth} onClick={() => handleClick("security")}>
            Sécurité
          </Button>
        </div>

        <div className="h-auto w-full p-8 rounded-md">
          {!isLoading ? (
            <>
              {tabName === "infos" && <UserInfosForm name={data?.name ?? null} email={data?.email ?? null} role={data?.role || "USER"} isOAuth={user?.isOAuth || false} />}
              {tabName === "preferences" && <UserPreferencesForm imgPath={data?.image ?? null} />}
              {tabName === "security" && <UserSecurityForm isTwoFactorEnabled={data?.isTwoFactorEnabled ?? false} />}
            </>
          ) : (
            <Loader />
          )}
        </div>
      </div>
    </div>
  );
}
