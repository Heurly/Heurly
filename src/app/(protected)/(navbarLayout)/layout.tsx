// import { Inter } from "next/font/google";
import "@/styles/globals.css";
import NavBar from "@/components/ui/nav-bar";

export default function NavBarLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="h-[100svh] gap-x-6 md:flex md:flex-row md:justify-between md:p-5">
			{/* <TopBar className="fixed top-0 z-50 flex h-16 w-full items-center justify-between bg-sky-200 p-3 md:hidden" /> */}
			<NavBar />
			<div className="h-full w-full px-3 pb-20 pt-3 md:p-[unset]">
				{children}
			</div>
		</div>
	);
}
