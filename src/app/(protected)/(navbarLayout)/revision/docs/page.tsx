import DeleteDocButton from "@/components/docs/DeleteDocButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { deleteNotes, getAllNotes } from "@/server/notes";
import { Docs, Notes } from "@prisma/client";
import { FileText } from "lucide-react";
import Link from "next/link";

async function getDocs() {
    // api call to get the docs
    const session = await getServerAuthSession();
    if (!session) return [];

    const docs = db.docs.findMany({
        where: {
            userId: session.user.id,
        },
    });
    return docs;
}

export default async function PageDocsList() {
    const docs: Docs[] = await getDocs();
    const notes: Notes[] | null = await getAllNotes();

    return (
        <>
            <Card className="flex w-full flex-col p-10">
                {docs.length == 0 && <p>Aucun document à afficher</p>}
                {docs.map((doc) => (
                    <FileCard file={doc} key={doc.id} />
                ))}
            </Card>
            <Card className="mt-6 flex w-full flex-col p-10">
                {notes === null || notes.length === 0 ? (
                    <p>Aucunes notes à afficher</p>
                ) : (
                    <>
                        {notes.map((n) => (
                            <NotesCard notes={n} key={n.id} />
                        ))}
                    </>
                )}
            </Card>
        </>
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

function NotesCard({ notes }: { notes: Notes }) {
    return (
        <Card className="m-1 flex w-1/3 flex-col justify-center gap-5 rounded-xl p-2">
            <div className="flex w-full items-center justify-between">
                <p>{notes.title}</p>
                <Link href={`/editor/${notes.id}`}>
                    <Button>
                        <FileText className="mr-2 h-4 w-4" /> Open
                    </Button>
                </Link>
                <DeleteDocButton docId={notes.id} />
            </div>
        </Card>
    );
}
