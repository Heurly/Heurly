// import { Inter } from "next/font/google";
import "@/styles/globals.css";
import NavBar from "@/components/ui/nav-bar";
import TopBar from "@/components/ui/top-bar";

export default function NavBarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="md:flex gap-x-6 md:flex-row md:justify-between md:p-5 h-[100svh]">
      <TopBar />
      <NavBar />
      <div className="w-full h-full px-3 pt-5 pb-28 md:p-[unset]">
        {children}
      </div>
    </div>
  );
}
