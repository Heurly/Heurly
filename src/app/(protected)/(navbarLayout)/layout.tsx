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
        <div className="h-[100svh] gap-x-6 md:flex md:flex-row md:justify-between md:p-5">
            <TopBar />
            <NavBar />
            <div className="h-full w-full px-3 pb-28 pt-5 md:p-[unset]">
                {children}
            </div>
        </div>
    );
}
