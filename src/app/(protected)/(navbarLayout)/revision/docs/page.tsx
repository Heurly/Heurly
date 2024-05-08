import DocsTable from "@/components/docs/DocsTable";
import NotesTable from "@/components/docs/NotesTable";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import isAllowedTo from "@/components/utils/is-allowed-to";
import { getServerAuthSession } from "@/server/auth";
import { getDocs } from "@/server/docs";
import { getAllNotes } from "@/server/notes";
import type { Docs, Notes } from "@prisma/client";
import { CirclePlus } from "lucide-react";
import Link from "next/link";

export default async function PageDocsList() {
    const session = await getServerAuthSession();
    if (!session) return null;

    const isAllowed = await isAllowedTo("show_docs", session.user.id);

    // if the user is not allowed to see the page, we return null
    if (!isAllowed.result) return null;

    const docs: Docs[] | null = await getDocs();
    const notes: Notes[] | null = await getAllNotes();

    return (
        <div className="flex h-full w-full flex-col gap-5 md:flex-row">
            <Card className="flex flex-col p-10 md:h-full md:w-1/2">
                <CardHeader>
                    <div className="flex w-full flex-col items-center justify-between gap-5 pb-8 text-center text-3xl font-bold md:flex-row md:text-left">
                        <p>Documents</p>
                        <Link href="/revision/docs/upload">
                            <Button className="flex gap-2">
                                <CirclePlus />
                                <p>Télécharger des fichiers</p>
                            </Button>
                        </Link>
                    </div>
                </CardHeader>
                <Separator className="mb-6" />
                <DocsTable data={docs ?? []} />
            </Card>
            <Card className="flex flex-col p-10 md:h-full md:w-1/2">
                <CardHeader>
                    <div className="flex w-full flex-col items-center justify-between gap-5 pb-8 text-center text-3xl font-bold md:flex-row md:text-left">
                        <p>Notes Publiques</p>
                        <Link href="/editor">
                            <Button className="flex gap-2">
                                <CirclePlus />
                                <p>Prendre des notes</p>
                            </Button>
                        </Link>
                    </div>
                </CardHeader>
                <Separator className="mb-6" />
                <NotesTable data={notes ?? []} />
            </Card>
        </div>
    );
}
