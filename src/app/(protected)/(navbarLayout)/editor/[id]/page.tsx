"use client";
import React, { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { createNotes, getNotes, updateNotes } from "@/server/notes";
import { Notes } from "@prisma/client";
import HeurlyEditor from "@/components/editor/HeurlyEditor";
import { EditorInstance, JSONContent } from "novel";
import { useDebouncedCallback } from "use-debounce";
import { LoaderCircle, Pen } from "lucide-react";
import { useSession } from "next-auth/react";
import { Switch } from "@/components/ui/switch";
import NotesVisibility from "@/components/docs/NotesVisibility";
import { Card } from "@/components/ui/card";
import UserProfile from "@/components/profile/UserProfile";

interface Props {
    params: { id: string };
}

const NotesEditor: React.FunctionComponent<Props> = ({ params }) => {
    const session = useSession();
    const [notes, setNotes] = useState<Notes | undefined>(undefined);

    const updates = useDebouncedCallback(async (editor?: EditorInstance) => {
        if (notes === undefined) return;
        console.log("update");
        const newNotes = notes;
        if (editor !== undefined) {
            const json = editor.getJSON();
            newNotes.content = json;
        }

        void updateNotes(newNotes);
        setNotes(newNotes);
    }, 500);

    useEffect(() => {
        const createNewNotes = async () => {
            const newNotes = await createNotes("Document sans nom");
            setNotes(newNotes ?? undefined);
        };

        if (params.id === undefined) {
            void createNewNotes();
            return;
        }

        void getNotes(params.id).then((r) => {
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
                    <ScrollArea className="flex h-full w-full flex-col rounded-l">
                        <Card className="flex flex-col items-center justify-between gap-2 p-4 md:h-[80px] md:flex-row">
                            <div className="flex items-center gap-5 md:w-5/6">
                                <Pen className="hidden md:visible" />
                                <Input
                                    className="!border-none !text-xl font-bold md:!text-3xl"
                                    type="text"
                                    disabled={
                                        session.data?.user.id !== notes.userId
                                    }
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
                            </div>
                            <div className="flex w-1/6 items-center justify-center gap-4 md:justify-end">
                                {session.data?.user.id === notes.userId ? (
                                    <>
                                        <NotesVisibility
                                            isPublic={notes.public}
                                        />
                                        <Switch
                                            disabled={
                                                session.data?.user.id !==
                                                notes.userId
                                            }
                                            onCheckedChange={async (v) => {
                                                setNotes({
                                                    ...notes,
                                                    public: v,
                                                });
                                                void updates();
                                            }}
                                            checked={notes.public}
                                        />
                                    </>
                                ) : (
                                    <UserProfile userId={notes.userId} />
                                )}
                            </div>
                        </Card>
                        {notes === undefined && (
                            <LoaderCircle className="animate-spin" />
                        )}
                        {notes !== undefined && (
                            <HeurlyEditor
                                canEdit={session.data?.user.id === notes.userId}
                                className="h-full w-full"
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
