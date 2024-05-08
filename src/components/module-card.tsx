import Link from "next/link";
import { Card } from "./ui/card";

export default function ModuleCard({
	name,
	icon,
	href,
}: {
	name: string;
	icon: React.ReactNode;
	href: string;
}) {
	return (
		<Link href={href}>
			<Card className="flex h-36 w-full cursor-pointer flex-col items-center justify-center gap-y-3 p-3 md:w-36">
				<div>{icon}</div>
				<div>
					<p className="text-center">{name}</p>
				</div>
			</Card>
		</Link>
	);
}
