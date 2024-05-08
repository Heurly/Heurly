import ModuleCard from "@/components/module-card";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ID from "@/utils/id";
import { Cog, Feather, List, UserRoundCog } from "lucide-react";

export default function AdminPage() {
	const adminPages = [
		{
			name: "Rôle par utilisateur",
			icon: <UserRoundCog />,
			href: "/admin/user-role",
		},
		{
			name: "Fonctionnalités par rôle",
			icon: <Cog />,
			href: "/admin/role-feature",
		},
		{
			name: "Créer une fonctionnalité",
			icon: <Feather />,
			href: "/admin/feature/create",
		},
		{
			name: "Liste des fonctionnalités",
			icon: <List />,
			href: "/admin/feature",
		},
	];

	return (
		<Card>
			<CardHeader>
				<h1 className="text-xl font-bold">
					Page d&apos;administrateur
				</h1>
			</CardHeader>
			<CardContent className="flex flex-col flex-wrap gap-5 md:flex-row">
				{adminPages.map((page) => (
					<ModuleCard
						key={ID()}
						name={page.name}
						icon={page.icon}
						href={page.href}
					/>
				))}
			</CardContent>
		</Card>
	);
}
