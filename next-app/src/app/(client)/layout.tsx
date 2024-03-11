import Header from "@/components/header";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-center p-24">{children}</main>
    </>
  );
}
