
import type { Metadata } from "next";
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
      <body>{children}</body>
    </html>
  );
}
