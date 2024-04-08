"use client";

import { Card } from "@/components/ui/card";
import React, { useEffect } from "react";
import { useState } from "react";
import { getDocById, getFile } from "@/server/docs";
import type { Docs } from "@prisma/client";

export default function PageDocs({ params }: { params: { id: string } }) {
    const docId = params.id;
    const [doc, setDoc] = useState<Docs>();
    const [pdfUrl, setPdfUrl] = useState<string>("");

    useEffect(() => {
        let isMounted = true; // Track whether the component is mounted

        const fetchDocs = async () => {
            try {
                const fetchedDoc: Docs = await getDocById(docId); // Assuming getDocs is defined elsewhere
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
            <Card className="flex h-full w-full flex-col gap-5 p-10">
                <h1 className="text-3xl font-bold">Document {doc?.title}</h1>
                <iframe
                    src={pdfUrl}
                    width="100%"
                    title={doc?.title}
                    height="100%"
                    className="aspect-auto"
                ></iframe>
            </Card>
        </>
    );
}
