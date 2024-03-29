import { auth, signIn, signOut } from "auth";
import Link from "next/link";

export default async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-[100] w-full h-20 shadow-md backdrop-blur  py-4 px-6">
      <div className="me-5">
        <Link href={"/admin/dashboard"}>Tableau de bord</Link>
      </div>
      {session && session.user ? (
        <div className="flex gap-2">
          <p>{session.user.name}</p>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button>Déconnexion</button>
          </form>
        </div>
      ) : (
        <form
          action={async () => {
            "use server";
            await signIn();
          }}
        >
          <button>Connexion</button>
        </form>
      )}
    </header>
  );
}
