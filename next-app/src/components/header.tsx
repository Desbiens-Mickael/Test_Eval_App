"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SidebarTrigger } from "@/components/ui/sidebar";
import UserItem from "@/components/user/user-item";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Separator } from "@radix-ui/react-separator";
import Link from "next/link";
import LinkCta from "./link-cta";
import Logo from "./logo";
import Notification from "./notification/notification";

export default function Header() {
  const user = useCurrentUser();

  return (
    <header className="sticky top-0 left-0 z-40 flex justify-between items-center gap-2 w-full h-16 backdrop-blur py-4 px-6">
      {!user ? (
        <>
          <div className="flex justify-start items-center w-fit rounded-md">
            <Link href={"/"}>
              <Logo
                width={80}
                height={40}
                type="horizontal"
                className="w-auto h-12 lg:h-16"
              />
            </Link>
          </div>
          <div className="hidden md:flex gap-3 md:me-8">
            <LinkCta
              href={"/auth/inscription"}
              text={"Inscription"}
              LinkType="outline"
            />
            <LinkCta href={"/auth/connexion"} text={"Connexion"} />
          </div>
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
                  <SheetTitle className="text-center">
                    Are you absolutely sure?
                  </SheetTitle>
                  <SheetDescription className="text-center">
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col sm:flex-row sm:justify-center gap-2 mt-4">
                  <SheetClose asChild>
                    <LinkCta
                      href={"/auth/inscription"}
                      text={"Inscription"}
                      LinkType="outline"
                    />
                  </SheetClose>
                  <SheetClose asChild>
                    <LinkCta href={"/auth/connexion"} text={"Connexion"} />
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </>
      ) : (
        <>
          <SidebarTrigger />
          <div className="flex items-center gap-4">
            <Notification />
            <Separator
              orientation="vertical"
              className="w-[2px] h-[25px] bg-border"
            />
            <UserItem
              fullName={user.name ?? ""}
              email={user.email ?? ""}
              avatarUrl={user.image ?? ""}
            />
          </div>
        </>
      )}
    </header>
  );
}
