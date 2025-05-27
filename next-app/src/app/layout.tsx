import { ThemeProvider } from "@/components/dark-mode/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import Providers from "@/lib/providers";
import { cn } from "@/lib/utils";
import { inter } from "@/style/fonts";
import { auth } from "auth";
import type { Metadata, Viewport } from "next";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import "./prosemirror.css";

export const metadata: Metadata = {
  title: {
    template: "%s | EduCraft",
    default: "EduCraft",
  },
  description:
    "EduCraft est un service de création d'exercices pour l'apprentissage",
};

export const viewport: Viewport = {
  width: "device-width",
  viewportFit: "cover",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session: Session | null = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="fr" suppressHydrationWarning>
        <body
          className={cn(
            inter.className,
            "flex flex-col min-h-screen text-foreground selection:bg-primary selection:text-primary-foreground"
          )}
        >
          <Providers>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster
                position="top-right"
                richColors={true}
                duration={5000}
                theme="light"
              />
            </ThemeProvider>
          </Providers>
        </body>
      </html>
    </SessionProvider>
  );
}
