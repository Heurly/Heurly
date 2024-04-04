"use client";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { getNotes, updateNotes } from "@/server/notes";
import { Notes } from "@prisma/client";
import HeurlyEditor from "@/components/editor/HeurlyEditor";
import { EditorInstance, JSONContent } from "novel";
import { useDebouncedCallback } from "use-debounce";
import { Pen } from "lucide-react";
import { useSession } from "next-auth/react";
import { Switch } from "@/components/ui/switch";
import NotesVisibility from "@/components/docs/NotesVisibility";
import { Card } from "@/components/ui/card";
import UserProfile from "@/components/profile/UserProfile";
import { TLog, log } from "@/logger/logger";
import useLocalStorage from "@/hooks/useLocalStorage";

interface Props {
    params: { id: string };
}

const NotesEditor: React.FunctionComponent<Props> = ({ params }) => {
    const session = useSession();
    const [notes, setNotes] = useLocalStorage<Notes | undefined>(
        "editor",
        undefined,
    );

    const updates = useDebouncedCallback(async (editor?: EditorInstance) => {
        if (notes === undefined) return;

        log({ type: TLog.info, text: "Saved editor content to db." });
        const newNotes = notes;
        if (editor !== undefined) {
            const json = editor.getJSON();
            newNotes.content = json;
            newNotes.updatedAt = new Date();
        }

        void updateNotes(newNotes);
        setNotes(newNotes);
    }, 500);

    useEffect(() => {
        const getNotesData = async () => {
            const dbNotes = await getNotes(params.id);
            if (dbNotes == null) return;
            setNotes(dbNotes);
        };

        if (notes === undefined) {
            void getNotesData();
        }
    }, [params.id, notes, setNotes]);

    return (
        <div className="h-full w-full">
            {notes !== undefined &&
                session?.data?.user?.id !== undefined &&
                (notes.userId === session.data.user.id || notes.public) && (
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
                                    value={notes?.title ?? ""}
                                    placeholder="Nom du document"
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
                                {session.data.user.id === notes.userId ? (
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

                        <HeurlyEditor
                            canEdit={session.data.user.id === notes.userId}
                            className="h-full w-full"
                            debouncedUpdates={updates}
                            initialContent={notes?.content as JSONContent}
                        />
                    </ScrollArea>
                )}
        </div>
    );
};

export default NotesEditor;
