import type { Metadata } from "next";
import { Geist, Geist_Mono, Cinzel, EB_Garamond } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const ebGaramond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Manuale del Giocatore — Lettore Interattivo D&D",
  description:
    "Piattaforma di lettura, esplorazione e ricerca rapida per il Manuale del Giocatore (321 pagine).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable} ${ebGaramond.variable} h-full antialiased`}
    >
      <body className="h-dvh w-full overflow-hidden flex flex-col">
        {children}
      </body>
    </html>
  );
}
