import { Card } from "@/components/ui/card";
import { db } from "@/server/db";
import B2 from "backblaze-b2";
import { env } from "@/env";

const b2 = new B2({
    applicationKeyId: env.BUCKET_KEY_ID,
    applicationKey: env.BUCKET_APP_KEY,
});

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
    // File authorization
    if (doc.url === null) return;
    await b2.authorize();
    const fileP = await b2.downloadFileById({
        fileId: doc.url,
        responseType: "arraybuffer", // options are as in axios: 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
        // ...common arguments (optional)
        onDownloadProgress: (progressEvent) => {
            console.log(progressEvent);
        },
    });
    const blob = new Blob([fileP.data], { type: "application/pdf" });
    const blobURL = URL.createObjectURL(blob);
    // pdf type
    // Create File variable
    let e;
    return (
        <>
            <Card className="flex h-full w-full flex-col gap-5 p-10">
                <h1 className=" text-3xl font-bold">{doc.title}</h1>
                <p className=" font-light text-gray-500">{doc.description}</p>
                <p>{blobURL}</p>
            </Card>
        </>
    );
}
