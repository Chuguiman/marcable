import type { Metadata } from "next";
import { Poppins, Jost } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-jost",
});

export const metadata: Metadata = {
  title: "Marcable — Búsqueda inteligente de marcas",
  description: "Motor de búsqueda de similitud de marcas registradas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${poppins.variable} ${jost.variable}`}>
      <body className="bg-page-bg dark:bg-[#0A0A0A] text-slate-900 dark:text-neutral-100 antialiased">
        {children}
      </body>
    </html>
  );
}
