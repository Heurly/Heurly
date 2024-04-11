import NotesTable from "@/components/docs/NotesTable";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { CourseCard } from "@/components/course-card";
import { Separator } from "@/components/ui/separator";
import isAllowedTo from "@/components/utils/is-allowed-to";
import { getServerAuthSession } from "@/server/auth";
import { getDocs } from "@/server/docs";
import { getAllNotes } from "@/server/notes";
import type { Docs, Notes } from "@prisma/client";
import { FileText, CirclePlus } from "lucide-react";
import Link from "next/link";

export default async function PageDocsList() {
    const session = await getServerAuthSession();
    if (!session) return null;

    const isAllowed = await isAllowedTo("show_docs", session.user.id);

    // if the user is not allowed to see the page, we return null
    if (!isAllowed.result) return null;

    const docs: Docs[] = await getDocs();
    const notes: Notes[] | null = await getAllNotes();


    const data = {
        name: "Entreprise Ressource Planninggggggggggggggggg"
    }
    return (
        <div className="flex h-full w-full flex-col gap-5 md:flex-row">
            <Card className="flex flex-col p-10 md:h-full md:w-1/2">
                <CardHeader className="text-3xl font-bold">
                    Documents
                </CardHeader>

                <div className="flex justify-start">
                    <CourseCard data={data} />
                    <CourseCard data={data} />
                </div>

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

function FileCard({ file }: { file: Docs }) {
    return (
        <Card className="flex h-1/6 w-full flex-col justify-center gap-5 p-10">
            <div className="flex w-full items-center justify-between">
                <p>{file.title}</p>
                <p>{file.description}</p>
                <Link href={`/revision/docs/${file.id}`}>
                    <Button>
                        <FileText className="mr-2 h-4 w-4" /> Open
                    </Button>
                </Link>
            </div>
        </Card>
    );
}
