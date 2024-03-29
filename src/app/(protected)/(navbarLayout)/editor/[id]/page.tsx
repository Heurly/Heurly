"use client";
import React, { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { createNotes, getNotes, updateNotes } from "@/server/notes";
import { Notes } from "@prisma/client";
import HeurlyEditor from "@/components/editor/HeurlyEditor";
import { EditorInstance, JSONContent } from "novel";
import { useDebouncedCallback } from "use-debounce";
import { LoaderCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { Switch } from "@/components/ui/switch";

interface Props {
    params: { id: string };
}

const NotesEditor: React.FunctionComponent<Props> = ({ params }) => {
    const session = useSession();
    const [notes, setNotes] = useState<Notes | undefined>(undefined);

    const updates = useDebouncedCallback(async (editor?: EditorInstance) => {
        if (notes === undefined) return;

        const newNotes = notes;
        if (editor !== undefined) {
            const json = editor.getJSON();
            newNotes.content = json;
        }

        void updateNotes(newNotes);
        setNotes(newNotes);
    }, 1500);

    useEffect(() => {
        const createNewNotes = async () => {
            const newNotes = await createNotes("Document sans nom");
            setNotes(newNotes ?? undefined);
        };

        if (params.id === undefined) {
            void createNewNotes();
            return;
        }

        void getNotes(parseInt(params.id)).then((r) => {
            if (r === null) {
                void createNewNotes();
            } else {
                setNotes(r ?? undefined);
            }
        });
    }, [params.id]);

    return (
        <div className="h-full w-full">
            {notes !== undefined &&
                (notes?.userId === session.data?.user.id || notes.public) && (
                    <ScrollArea className="flex h-full w-full flex-col rounded-l border border-sky-100 p-4">
                        <div className="flex justify-between align-middle">
                            <Input
                                className="!w-1/2 !border-none !text-3xl font-bold"
                                type="text"
                                value={notes?.title ?? "Chargement..."}
                                onChange={(event) => {
                                    if (notes === undefined) return;
                                    setNotes({
                                        ...notes,
                                        title: event.target.value,
                                    });
                                    void updates();
                                }}
                            />
                            {notes !== undefined && (
                                <div className="flex justify-center gap-4 align-middle">
                                    <p className="align-middle text-sm">
                                        Notes Publiques
                                    </p>
                                    <Switch
                                        onCheckedChange={async (v) => {
                                            setNotes({
                                                ...notes,
                                                public: v,
                                            });
                                            void updates();
                                        }}
                                        checked={notes.public}
                                    />
                                </div>
                            )}
                        </div>
                        <Separator className="mb-6" />
                        {notes === undefined && (
                            <LoaderCircle className="animate-spin" />
                        )}
                        {notes !== undefined && (
                            <HeurlyEditor
                                className="rounded-l"
                                debouncedUpdates={updates}
                                initialContent={notes?.content as JSONContent}
                            />
                        )}
                    </ScrollArea>
                )}
        </div>
    );
};

export default NotesEditor;
