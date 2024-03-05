import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { Docs } from "@prisma/client";
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
    return (
        <>
            <Card className="flex h-full w-full flex-col gap-5 p-10">
                {docs.length == 0 && <p>Aucun document à afficher</p>}
                {docs.map((doc) => (
                    <FileCard file={doc} key={doc.id} />
                ))}
            </Card>
        </>
    );
}

export function FileCard({ file }: { file: Docs }) {
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
