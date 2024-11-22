"use client";

import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import UserItem from "@/components/user/user-item";
import { useCurrentUser } from "@/hooks/use-current-user";
import Link from "next/link";
import LinkCta from "./link-cta";
import Logo from "./logo";

export default function Header() {
  const user = useCurrentUser();

  return (
    <header className="sticky top-0 left-0 z-40 flex justify-between items-center gap-2 w-full h-16 shadow-md backdrop-blur py-4 px-6">
      <div className=" w-[150px]">
        <Link href={"/"} className="flex gap-2 items-center">
          <Logo width={150} height={200} type="horizontal" className="w-full h-auto md:ms-8" />
        </Link>
      </div>
      {!user ? (
        <div className="hidden md:flex gap-3 md:me-8">
          <LinkCta href={"/auth/inscription"} text={"Inscription"} LinkType="outline" />
          <LinkCta href={"/auth/connexion"} text={"Connexion"} />
        </div>
      ) : (
        <UserItem fullName={user.name ?? ""} email={user.email ?? ""} avatarUrl={user.image ?? ""} />
      )}
      <div className="block md:hidden">
        <Sheet>
          <SheetTrigger>
            <div className="flex flex-col justify-center items-center gap-1 w-8 rounded-md bg-secondary-foreground shadow-md-500 p-2">
              <div className="w-full h-[2px] bg-secondary rounded-full"></div>
              <div className="w-full h-[2px] bg-secondary rounded-full"></div>
              <div className="w-full h-[2px] bg-secondary rounded-full"></div>
            </div>
          </SheetTrigger>
          <SheetContent side={"top"} className="top-16">
            <SheetHeader>
              <SheetTitle className="text-center">Are you absolutely sure?</SheetTitle>
              <SheetDescription className="text-center">This action cannot be undone. This will permanently delete your account and remove your data from our servers.</SheetDescription>
            </SheetHeader>
            <div className="flex flex-col sm:flex-row sm:justify-center gap-2 mt-4">
              <SheetClose asChild>
                <LinkCta href={"/auth/inscription"} text={"Inscription"} LinkType="outline" />
              </SheetClose>
              <SheetClose asChild>
                <LinkCta href={"/auth/connexion"} text={"Connexion"} />
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
