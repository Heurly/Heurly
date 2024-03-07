import Logo from "@/components/icon/Logo";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import {
    Calendar,
    CalendarCheck,
    FileStack,
    LogOut,
    Settings,
} from "lucide-react";
import InstallPwaButton from "../PWA/install-pwa-button";

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
        <nav className="fixed bottom-0 left-1/2 z-40 mb-4 flex w-11/12 -translate-x-1/2 flex-col items-center justify-between rounded-3xl bg-sky-200 px-3 py-4 md:relative md:left-[unset] md:top-[unset] md:h-full md:w-[unset] md:translate-x-0 md:py-10">
            <Link href="/" data-cy="logo" className="hidden md:block">
                <Logo className=" w-16" />
            </Link>
            <div className="flex w-full justify-between gap-10 px-5 md:w-[unset] md:flex-col">
                {navbarElement.map(({ href, name, icon }, index) => {
                    return (
                        <NavBarItems
                            key={index}
                            name={name}
                            icon={icon}
                            href={href}
                        />
                    );
                })}
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <InstallPwaButton variant={"icon"}/>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Installer heurly</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <div className="hidden flex-col justify-between gap-5 md:flex">
                <NavBarItems
                    href="/logout"
                    name="Déconnexion"
                    icon={<LogOut />}
                />
                <NavBarItems
                    href="/settings"
                    name="Paramètres"
                    icon={<Settings />}
                />
            </div>
        </nav>
    );
}
