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
            <Card className="flex h-36 w-36 cursor-pointer flex-col items-center justify-center">
                <div>{icon}</div>
                <div>
                    <p>{name}</p>
                </div>
            </Card>
        </Link>
    );
}
