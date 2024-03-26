import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import isAllowedTo from "@/components/utils/is-allowed-to";
import { getServerAuthSession } from "@/server/auth";
import ID from "@/utils/id";
import { Archive, MessageCircleQuestion } from "lucide-react";
import Link from "next/link";

export default async function ChoosePlugInPage() {
    const plugIns = [
        // {
        //     name: "Flashcards",
        //     icon: <Zap />,
        //     href: "/flashcards",
        // },
    ];

    const session = await getServerAuthSession();
    if (!session) return null;
    const userId = session.user.id;

    const [isAllowedToSeeDocs, isAllowedToSeeQandA] = await Promise.all([
        isAllowedTo("show_docs", userId),
        isAllowedTo("show_qanda", userId),
    ]);

    if (isAllowedToSeeDocs.result)
        plugIns.push({
            name: "Documents",
            icon: <Archive />,
            href: "/docs",
        });
    if (isAllowedToSeeQandA.result)
        plugIns.push({
            name: "Q & A",
            icon: <MessageCircleQuestion />,
            href: "/QandA",
        });

    if (plugIns.length === 0) return null;

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
