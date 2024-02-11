import Logo from "@/components/icon/Logo";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { Calendar, CalendarCheck, FileStack, LogOut, Settings } from "lucide-react";

type PropsNavBarItems = {
    name: React.ReactNode;
    icon: React.ReactNode;
    href: string;
};

function NavBarItems({ name, icon, href }: PropsNavBarItems) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link href={href}>{icon}</Link>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{name}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export default function NavBar() {
    const navbarElement = [
        {
            name: "Emplois du temps",
            icon: <Calendar />,
            href: "/timetable",
        },
        {
            name: "Révisions",
            icon: <FileStack />,
            href: "/revision",
        },
        {
            name: "Evénements",
            icon: <CalendarCheck />,
            href: "/event",
        },
    ];
    return (
        <nav className="flex flex-col justify-between items-center md:h-full md:w-[unset] w-11/12 fixed bottom-0 mb-4 left-1/2 md:left-[unset] -translate-x-1/2 z-50 md:translate-x-0 md:relative md:top-[unset] px-3 md:py-10 py-4 bg-sky-200 rounded-3xl">
            <Link href="/" data-cy="logo" className="hidden md:block">
                <Logo className=" w-16" />
            </Link>
            <div className="flex md:flex-col gap-10 justify-between w-full md:w-[unset] px-5">
                {navbarElement.map(({ href, name, icon }, index) => (
                    <NavBarItems key={index} name={name} icon={icon} href={href} />
                ))}
            </div>
            <div className="md:flex flex-col gap-5 justify-between hidden">
                <NavBarItems href="/logout" name="Déconnexion" icon={<LogOut />} />
                <NavBarItems
                    href="/settings"
                    name="Paramètres"
                    icon={<Settings />}
                />
            </div>
        </nav>
    );
}