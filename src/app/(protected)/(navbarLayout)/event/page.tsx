import { buttonVariants } from "@/components/ui/button";
import { List, MailQuestion } from "lucide-react";
import Link from "next/link";

import cn from "classnames";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export const metadata = {
    title: "Heuly - Evenements",
    description:
        "Cette page répertorie toutes les évenement de l'école ! Vous pouvez y participer ou créer votre propre événement.",
};

function CreateEventButton({
    className,
    href,
    icon,
    text,
}: {
    className?: string;
    href: string;
    icon: React.ReactNode;
    text: string;
}) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link
                        className={cn(
                            buttonVariants({ variant: "default" }),
                            "h-28",
                            className,
                        )}
                        href={href}
                    >
                        {icon}
                    </Link>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{text}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export default async function EventLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerAuthSession();
    if (!session) redirect("/login");
    const buttonEvent = [
        {
            href: "/event/",
            icon: <List />,
            text: "Liste des évenements",
        },
        {
            href: "/event/create",
            icon: <MailQuestion />,
            text: "Créer un événement",
        },
    ];
    return (
        <div className="my-16 flex w-full items-center justify-start gap-5 md:my-0 md:h-full md:overflow-auto">
            <div className="flex h-full w-full flex-col items-center justify-start gap-5 overflow-auto">
                {children}
            </div>
            <div className="hidden h-full w-1/12 flex-col gap-y-5 md:flex">
                {buttonEvent.map((button, index) => (
                    <CreateEventButton
                        key={index}
                        href={button.href}
                        icon={button.icon}
                        text={button.text}
                    />
                ))}
            </div>

            <Link
                href="/revision/QandA/question/create"
                className="fixed bottom-20 right-5 flex h-20 w-20 rounded-full p-7 md:hidden md:h-28"
            >
                <MailQuestion />
            </Link>
        </div>
    );
}
