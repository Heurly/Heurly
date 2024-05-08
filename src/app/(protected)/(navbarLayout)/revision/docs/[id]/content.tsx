"use client";
import NotesVisibility from "@/components/docs/NotesVisibility";
import UserProfile from "@/components/profile/UserProfile";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { getDocById, getFile } from "@/server/docs";
import type { Docs } from "@prisma/client";
import { Download, ExternalLink } from "lucide-react";
import { SessionProvider, useSession } from "next-auth/react";
import Link from "next/link";
import { notFound } from "next/navigation";
import React, { useEffect } from "react";
import { useState } from "react";

function DocsInfo({ doc, url }: { doc: Docs; url: string }) {
    const session = useSession();
    return (
        <div className="size-full space-y-4">
            <div className=" md:h-34 flex flex-col items-center justify-between gap-2 p-4 md:flex-row ">
                <div className="flex items-center gap-5 md:w-5/6">
                    <h1 className="text-2xl font-bold">{doc?.title}</h1>
                </div>
                <div className="flex min-h-min w-1/6 items-center justify-center gap-4 md:justify-end">
                    {session.data?.user.id === doc?.userId ? (
                        <>
                            <NotesVisibility isPublic={doc?.public} />
                            <Switch
                                disabled={session.data?.user.id !== doc?.userId}
                                checked={doc?.public}
                            />
                        </>
                    ) : (
                        <UserProfile userId={doc?.userId} />
                    )}
                </div>
            </div>
            <div className="space-y-4">
                <div>
                    <h2 className="text-xl font-bold">Description</h2>
                </div>
                <div>
                    <p>{doc?.description}</p>
                </div>
            </div>
            <div>
                <h2 className=" text-base font-bold text-gray-400">
                    Matières associés
                </h2>
                <div className="h-8 w-16 rounded-xl bg-sky-300" />
            </div>
            <div>
                <div className="flex size-full flex-col gap-4">
                    <div className="md:hidden ">
                        <Link href={url}>
                            <Button className="size-full">
                                <ExternalLink size={24} />
                                <p> Ouvrir</p>
                            </Button>
                        </Link>
                    </div>
                    <div>
                        <Button
                            className="size-full"
                            onClick={
                                // download pdf
                                () => {
                                    const a = document.createElement("a");
                                    a.href = url;
                                    a.download = doc.title;
                                    a.click();
                                }
                            }
                        >
                            <Download size={24} />
                            <p> Télécharger</p>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function ContentDocs({ docId }: { docId: string }) {
    const [doc, setDoc] = useState<Docs>();
    const [pdfUrl, setPdfUrl] = useState<string>("");

    useEffect(() => {
        const fetchDocs = async () => {
            let fetchedDoc = null;
            let fetchedBlob = null;
            // Fetch doc from db
            try {
                fetchedDoc = await getDocById(docId);
                if (!fetchedDoc) return notFound();
                setDoc(fetchedDoc);
            } catch (error) {
                console.error("Doc not found :", error);
            }

            if (!fetchedDoc) {
                return notFound();
            }

            // Fetch pdf from bucket
            try {
                const json = await getFile(fetchedDoc);
                if (!json) {
                    throw new Error("Failed to fetch docs : no json");
                }
                const parsed = JSON.parse(json) as { blob: string };
                const buffer = Buffer.from(parsed.blob, "base64");
                fetchedBlob = new Blob([buffer], {
                    type: "application/pdf",
                });

                // Create url for pdf
                const url = URL.createObjectURL(fetchedBlob);
                setPdfUrl(url);
            } catch (error) {
                console.error("Failed to fetch doc:", error);
            }
        };

        void fetchDocs();
    }, [setDoc, docId, setPdfUrl]);

    return (
        <SessionProvider>
            <>
                {doc?.public && doc.userId && pdfUrl !== "" && (
                    <div className="size-full gap-y-5">
                        <Card className="flex h-full flex-col gap-5 p-4 md:flex-row md:p-10">
                            <div className=" h-full md:w-1/2">
                                <DocsInfo doc={doc} url={pdfUrl} />
                            </div>
                            <div className="hidden border md:block md:w-1/2">
                                <iframe
                                    src={pdfUrl}
                                    title={doc?.title}
                                    height="100%"
                                    width="100%"
                                    className="aspect-auto size-full flex-col"
                                />
                            </div>
                        </Card>
                    </div>
                )}
            </>
        </SessionProvider>
    );
}
