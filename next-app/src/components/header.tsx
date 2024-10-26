"use client";
import { useCurrentUser } from "@/hooks/use-current-user";
import Link from "next/link";

export default function Header() {
  const user = useCurrentUser();

  return (
    <header className="sticky top-0 z-[100] flex gap-2 w-full h-20 shadow-md backdrop-blur  py-4 px-6">
      {!user && (
        <div className="flex gap-3">
          <Link href={"/auth/inscription"}>inscription</Link> <Link href={"/auth/connexion"}>Connexion</Link>
        </div>
      )}
    </header>
  );
}
