"use client";

import { Card } from "@/components/ui/card";
import React, { useEffect } from "react";
import { useState } from "react";
import { getDocById, getFile } from "@/server/docs";
import type { Docs } from "@prisma/client";
import { SessionProvider, useSession } from "next-auth/react";
import NotesVisibility from "@/components/docs/NotesVisibility";
import { Switch } from "@/components/ui/switch";
import UserProfile from "@/components/profile/UserProfile";

export default function Page({ params }: { params: { id: string } }) {
    return (
        <SessionProvider>
            <ContentDocs docId={params.id} />
        </SessionProvider>
    );
}

function ContentDocs({ docId }: { docId: string }) {
    const session = useSession();
    const [doc, setDoc] = useState<Docs>();
    const [pdfUrl, setPdfUrl] = useState<string>("");

    useEffect(() => {
        let isMounted = true; // Track whether the component is mounted

        const fetchDocs = async () => {
            try {
                const fetchedDoc: Docs = await getDocById(docId);
                if (!fetchedDoc) return;
                // Assuming getDocs is defined elsewhere
                if (isMounted) {
                    setDoc(fetchedDoc);
                    console.log(fetchedDoc);
                    const testdoc = fetchedDoc;
                    const json = await getFile(testdoc);
                    const parsed = JSON.parse(json) as { blob: string };
                    const buffer = Buffer.from(parsed.blob, "base64");
                    const blob = new Blob([buffer], {
                        type: "application/pdf",
                    });
                    const url = URL.createObjectURL(blob);
                    setPdfUrl(url);
                }
            } catch (error) {
                console.error("Failed to fetch docs:", error);
            }
        };

        void fetchDocs();

        return () => {
            isMounted = false; // Cleanup function to set isMounted to false when the component unmounts
        };
    }, [docId, setDoc, setPdfUrl]);

    return (
        <>
            {doc && doc.public && doc.userId && (
                <div className="flex h-full flex-col gap-y-5">
                    {/* // <Card className="flex h-full w-full flex-col gap-5 p-10"> */}
                    <Card className="md:h-34 flex flex-col items-center justify-between gap-2 border p-4 md:flex-row">
                        <div className="flex items-center gap-5 md:w-5/6">
                            {/* <Pen className="hidden md:visible" /> */}
                            <h1 className="text-2xl font-bold">
                                Document {doc?.title}
                            </h1>
                        </div>
                        <div className="flex min-h-min w-1/6 items-center justify-center gap-4 md:justify-end">
                            {session.data?.user.id === doc?.userId ? (
                                <>
                                    <NotesVisibility isPublic={doc?.public} />
                                    <Switch
                                        disabled={
                                            session.data?.user.id !==
                                            doc?.userId
                                        }
                                        checked={doc?.public}
                                    />
                                </>
                            ) : (
                                <UserProfile userId={doc?.userId} />
                            )}
                        </div>
                    </Card>
                    <Card className="flex h-full flex-col gap-5 p-10">
                        <iframe
                            src={pdfUrl}
                            width="100%"
                            title={doc?.title}
                            height="100%"
                            className="aspect-auto"
                        ></iframe>
                    </Card>
                </div>
            )}
        </>
    );
}
