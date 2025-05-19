import Footer from "@/components/footer";
import Header from "@/components/header/public-header";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col items-center lg:pt-8">
        {children}
      </main>
      <Footer />
    </>
  );
}
