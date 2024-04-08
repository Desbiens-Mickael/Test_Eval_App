"use client";
import { useCurrentUser } from "@/hooks/use-current-user";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";

export default function Header() {
  const user = useCurrentUser();

  return (
    <header className="sticky top-0 z-[100] w-full h-20 shadow-md backdrop-blur  py-4 px-6">
      <div className="me-5">
        <Link href={"/admin/dashboard"}>Tableau de bord</Link>
      </div>
      {user ? (
        <div className="flex gap-2">
          <p>{user?.name}</p>
          <form
            action={async () => {
              await signOut();
            }}
          >
            <button>Déconnexion</button>
          </form>
        </div>
      ) : (
        <form
          action={async () => {
            await signIn();
          }}
        >
          <button>Connexion</button>
        </form>
      )}
    </header>
  );
}
