import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import LinkCta from "../link-cta";
import Logo from "../logo";

export default function PublicHeader() {
  return (
    <header
      className={
        "flex justify-between items-center gap-2 w-full h-16 py-4 px-6 sticky top-0 left-0 z-40 backdrop-blur"
      }
    >
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
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
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
    </header>
  );
}
