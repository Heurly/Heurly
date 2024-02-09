import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import cn from "classnames";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={cn(inter.className, "bg-sky-100")}>{children}</body>
    </html>
  );
}