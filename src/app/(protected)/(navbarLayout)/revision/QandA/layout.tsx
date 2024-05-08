import { buttonVariants } from "@/components/ui/button";
import { List, MailQuestion } from "lucide-react";
import Link from "next/link";

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { getServerAuthSession } from "@/server/auth";
import cn from "classnames";
import { redirect } from "next/navigation";
import ID from "@/utils/id";

export const metadata = {
	title: "Heuly - Questions",
	description:
		"Cette page répertorie toutes les questions posées par les utilisateurs d'Heurly ! Vous pouvez y répondre ou poser votre propre question.",
};

function QandAButton({
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

export default async function QandALayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getServerAuthSession();
	if (!session) redirect("/login");
	const buttonsQandA = [
		{
			href: "/revision/QandA",
			icon: <List />,
			text: "Liste des questions",
		},
		{
			href: "/revision/QandA/question/create",
			icon: <MailQuestion />,
			text: "Poser une question",
		},
	];
	return (
		<div className="my-16 flex w-full items-center justify-start gap-5 md:my-0 md:h-full md:overflow-auto">
			<div className="flex h-full w-full flex-col items-center justify-start gap-5 overflow-auto">
				{children}
			</div>
			<div className="hidden h-full w-1/12 flex-col gap-y-5 md:flex">
				{buttonsQandA.map((button) => (
					<QandAButton
						key={ID()}
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
