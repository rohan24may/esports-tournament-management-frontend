
import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "DROPZONE. | Esports Analytics",
  description:
    "Track esports tournaments, teams, players and competitive statistics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Suspense
          fallback={
            <main className="flex min-h-screen items-center justify-center bg-[var(--background)]">
              <p className="text-sm font-bold tracking-widest text-[var(--accent)]">
                LOADING DROPZONE...
              </p>
            </main>
          }
        >
          {children}
        </Suspense>
      </body>
    </html>
  );
}
