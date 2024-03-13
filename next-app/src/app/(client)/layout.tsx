import Header from "@/components/header";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="h-full flex flex-col items-center">{children}</main>
    </>
  );
}
