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
    Shield,
    // Settings,
    User,
} from "lucide-react";
import InstallPwaButton from "../PWA/install-pwa-button";
import LogOutButton from "../log-out-button";
import { getServerAuthSession } from "@/server/auth";
import isAllowedTo from "../utils/is-allowed-to";

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

export default async function NavBar() {
    const session = await getServerAuthSession();

    if (!session) return null;

    const userId = session.user.id;

    const navbarElement = [];

    const [
        isAllowedToSeeTimetable,
        isAllowedToSeeRevision,
        isAllowedToSeeEvent,
        isAllowedToSeeAdmin,
    ] = await Promise.all([
        isAllowedTo("show_timetable", userId),
        isAllowedTo("show_revision", userId),
        isAllowedTo("show_event", userId),
        isAllowedTo("show_admin", userId),
    ]);

    if (isAllowedToSeeTimetable.result)
        navbarElement.push({
            name: "Emplois du temps",
            icon: <Calendar />,
            href: "/timetable",
        });
    if (isAllowedToSeeRevision.result)
        navbarElement.push({
            name: "Révisions",
            icon: <FileStack />,
            href: "/revision",
        });
    if (isAllowedToSeeEvent.result)
        navbarElement.push({
            name: "Evénements",
            icon: <CalendarCheck />,
            href: "/event",
        });
    if (isAllowedToSeeAdmin.result)
        navbarElement.push({
            name: "Admin",
            icon: <Shield className="text-red-500" />,
            href: "/admin",
        });

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
                            <InstallPwaButton variant={"icon"} />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Installer heurly</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <div className="hidden flex-col justify-between gap-5 md:flex">
                <NavBarItems href="/profile" name="Profil" icon={<User />} />
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <LogOutButton />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Déconnexion</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                {/* <NavBarItems
                    href="/settings"
                    name="Paramètres"
                    icon={<Settings />}
                /> */}
            </div>
        </nav>
    );
}
