import { Card } from "@/components/ui/card";
import { db } from "@/server/db";
import B2 from "backblaze-b2";
import { env } from "@/env";

async function getDoc(id: string) {
    // api call to get the docs
    const doc = db.docs.findUnique({
        where: {
            id: id,
        },
    });
    return doc;
}

export default async function PageDocs({ params }: { params: { id: string } }) {
    const doc = await getDoc(params.id);
    if (!doc) return <p>Document not found</p>;
    // Title
    // Description
    // File viewer with pdf js
    return (
        <>
            <Card className="flex h-full w-full flex-col gap-5 p-10">
                <h1 className=" text-3xl font-bold">{doc.title}</h1>
                <p className=" font-light text-gray-500">{doc.description}</p>
                <p>{doc.url}</p>
            </Card>
        </>
    );
}
