import ModuleCard from "@/components/module-card";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ID from "@/utils/id";
import { Cog, UserRoundCog } from "lucide-react";

export default function AdminPage() {
    const adminPages = [
        {
            name: "User role",
            icon: <UserRoundCog />,
            href: "/admin/user-role",
        },
        {
            name: "Role feature",
            icon: <Cog />,
            href: "/admin/role-feature",
        },
    ];

    return (
        <Card>
            <CardHeader>
                <h1 className="text-xl font-bold">Admin Page</h1>
            </CardHeader>
            <CardContent className="flex gap-5">
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
