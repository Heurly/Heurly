"use client";
import { createNotes } from "@/server/notes";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect } from "react";

const NewNotes: React.FunctionComponent = () => {
    const router = useRouter();

    useEffect(() => {
        const createNewNotes = async () => {
            const newNotes = await createNotes("Document sans nom");
            if (newNotes == null) return;
            void router.push(`/editor/${newNotes.id}`);
        };

        void createNewNotes();
    }, [router]);

    return <></>;
};

export default NewNotes;
