import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ID from "@/utils/id";
import { Archive, MessageCircleQuestion, Zap } from "lucide-react";
import Link from "next/link";

export default function ChoosePlugInPage() {
    const plugIns = [
        {
            name: "Documents",
            icon: <Archive />,
            href: "/docs",
        },
        {
            name: "Flashcards",
            icon: <Zap />,
            href: "/flashcards",
        },
        {
            name: "Q & A",
            icon: <MessageCircleQuestion />,
            href: "/QandA",
        },
    ];

    return (
        <Card className="flex h-full w-full flex-col items-center justify-center gap-5 p-10">
            <Input placeholder="Rechercher un plug-in" />

            <div className="flex flex-wrap gap-5">
                {plugIns?.map(({ name, icon, href }) => (
                    <Link href={`/revision${href}`} key={ID()}>
                        <Card className="flex h-36 w-36 cursor-pointer flex-col items-center justify-center">
                            <div>{icon}</div>
                            <div>
                                <p>{name}</p>
                            </div>
                        </Card>
                    </Link>
                ))}
                {!plugIns && <p>Aucun plug-in trouvé</p>}
            </div>
        </Card>
    );
}
